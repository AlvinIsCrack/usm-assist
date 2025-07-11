import type { Ramo } from "$lib/states/calendario.svelte";
import _ASIGNATURAS from "./horario_asignaturas.json";

//@ts-ignore
let ASIGNATURAS: {
    [sede: string]: {
        [jornada: string]: {
            [periodo: string]: {
                [sigla_ramo: string]: {
                    [paralelo: string]: Ramo;
                };
            };
        };
    };
} = _ASIGNATURAS;

export { ASIGNATURAS };