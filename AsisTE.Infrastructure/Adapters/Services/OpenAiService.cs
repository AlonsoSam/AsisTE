using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using AsisTE.Application.Ports.Services;
using Microsoft.Extensions.Configuration;

namespace AsisTE.Infrastructure.Adapters.Services;

public class OpenAiService(
    HttpClient httpClient,
    IConfiguration configuration)
    : IAiService
{
    public async Task<string> GenerateAttendanceSummaryAsync(
        string studentName,
        string attendanceData,
        CancellationToken cancellationToken)
    {
        var apiKey = configuration["OpenAI:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException(
                "La API de inteligencia artificial no está configurada"
            );

        var model =
            configuration["OpenAI:Model"]
            ?? "gpt-6-luna";

        httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                apiKey
            );

        var prompt = $"""
        Eres un asistente para un sistema escolar de control de asistencia.

        Analiza únicamente los datos proporcionados del estudiante
        {studentName}.

        Datos de asistencia:
        {attendanceData}

        Genera un resumen breve y profesional en español.

        Debes:
        - mencionar la cantidad de registros
        - identificar si existen tardanzas o ausencias
        - destacar el comportamiento general de asistencia
        - dar una recomendación corta si corresponde
        - no inventar información que no aparezca en los datos

        Responde en un máximo de 120 palabras.
        """;

        var request = new
        {
            model,
            input = prompt
        };

        using var response =
            await httpClient.PostAsJsonAsync(
                "https://api.openai.com/v1/responses",
                request,
                cancellationToken
            );

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException(
                "No se pudo generar el resumen con inteligencia artificial"
            );
        }

        var json =
            await response.Content.ReadAsStringAsync(
                cancellationToken
            );

        using var document = JsonDocument.Parse(json);

        var output = document
            .RootElement
            .GetProperty("output");

        foreach (var item in output.EnumerateArray())
        {
            if (!item.TryGetProperty(
                    "type",
                    out var itemType) ||
                itemType.GetString() != "message")
            {
                continue;
            }

            if (!item.TryGetProperty(
                    "content",
                    out var content))
            {
                continue;
            }

            foreach (var part in content.EnumerateArray())
            {
                if (part.TryGetProperty(
                        "type",
                        out var type) &&
                    type.GetString() == "output_text" &&
                    part.TryGetProperty(
                        "text",
                        out var text))
                {
                    return text.GetString()
                           ?? "No se generó un resumen.";
                }
            }
        }

        return "No se generó un resumen.";
    }
}