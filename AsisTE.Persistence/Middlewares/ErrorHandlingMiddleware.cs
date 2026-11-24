using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace AsisTE.Persistence.Middlewares;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(
        RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(
                context,
                exception
            );
        }
    }

    private static async Task HandleExceptionAsync(
        HttpContext context,
        Exception exception)
    {
        context.Response.ContentType =
            "application/json";

        var statusCode =
            HttpStatusCode.InternalServerError;

        var message =
            "Ocurrió un error interno en el servidor";

        // credenciales incorrectas
        if (exception is UnauthorizedAccessException)
        {
            statusCode =
                HttpStatusCode.Unauthorized;

            message =
                exception.Message;
        }

        // registro no encontrado
        else if (exception is KeyNotFoundException)
        {
            statusCode =
                HttpStatusCode.NotFound;

            message =
                exception.Message;
        }

        // validaciones de negocio
        else if (exception is InvalidOperationException)
        {
            statusCode =
                HttpStatusCode.BadRequest;

            message =
                exception.Message;
        }

        // restricciones de claves foráneas
        else if (
            exception is DbUpdateException
                dbUpdateException &&
            dbUpdateException.InnerException
                is PostgresException
                postgresException &&
            postgresException.SqlState == "23503"
        )
        {
            statusCode =
                HttpStatusCode.Conflict;

            message =
                GetForeignKeyMessage(
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
            // estudiante con asistencias
            "attendances_student_id_fkey" =>
                "No se puede eliminar el estudiante porque tiene registros de asistencia asociados.",

            // estudiante vinculado a apoderados
            "student_guardians_student_id_fkey" =>
                "No se puede eliminar el estudiante porque tiene apoderados asociados.",

            // apoderado vinculado a estudiante
            "student_guardians_guardian_id_fkey" =>
                "No se puede eliminar el apoderado porque está asociado a uno o más estudiantes.",

            // apoderado con notificaciones
            "notifications_guardian_id_fkey" =>
                "No se puede eliminar el apoderado porque tiene notificaciones asociadas.",

            // dispositivo usado en asistencias
            "attendances_device_id_fkey" =>
                "No se puede eliminar el dispositivo porque tiene registros de asistencia asociados.",

            // usuario con roles asignados
            "user_roles_user_id_fkey" =>
                "No se puede eliminar el usuario porque tiene roles asignados.",

            // rol asignado a usuarios
            "user_roles_role_id_fkey" =>
                "No se puede eliminar el rol porque está asignado a uno o más usuarios.",

            _ =>
                "No se puede eliminar este registro porque tiene información relacionada."
        };
    }
}