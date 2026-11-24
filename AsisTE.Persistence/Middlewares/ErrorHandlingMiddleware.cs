using System.Net;
using System.Text.Json;
using Npgsql;

namespace AsisTE.Persistence.Middlewares;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception)
    {
        context.Response.ContentType = "application/json";

        var statusCode = HttpStatusCode.InternalServerError;

        var message =
            "Ocurrió un error interno en el servidor";

        // error de integridad referencial de PostgreSQL
        if (
            exception is Microsoft.EntityFrameworkCore
                .DbUpdateException dbUpdateException &&
            dbUpdateException.InnerException
                is PostgresException postgresException &&
            postgresException.SqlState == "23503"
        )
        {
            statusCode = HttpStatusCode.Conflict;

            message = GetForeignKeyMessage(
                postgresException.ConstraintName
            );
        }

        context.Response.StatusCode =
            (int)statusCode;

        var response = new
        {
            message
        };

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(response)
        );
    }

    private static string GetForeignKeyMessage(
        string? constraintName)
    {
        return constraintName switch
        {
            "attendances_student_id_fkey" =>
                "No se puede eliminar el estudiante porque tiene registros de asistencia asociados.",

            "notifications_guardian_id_fkey" =>
                "No se puede eliminar el apoderado porque tiene notificaciones asociadas.",

            "student_guardians_student_id_fkey" =>
                "No se puede eliminar el estudiante porque tiene apoderados asociados.",

            "student_guardians_guardian_id_fkey" =>
                "No se puede eliminar el apoderado porque está asociado a un estudiante.",

            "attendances_device_id_fkey" =>
                "No se puede eliminar el dispositivo porque tiene registros de asistencia asociados.",

            _ =>
                "No se puede eliminar este registro porque tiene información relacionada."
        };
    }
}