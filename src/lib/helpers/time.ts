import { DAY_FIRST_MINUTES, BLOQUE_DURATION_MINUTES, BREAK_DURATION_MINUTES, BLOQUE_COMIDA, BLOQUE_COMIDA_DURATION_MINUTES } from "$lib/constants/usm";

export default class Time {
	static HHMMtoMinutes(hhmm: string) {
		const [h, m] = hhmm.split(":").map(Number);
		return h * 60 + m;
	}

	static MinutesToHHMM(minutes: number) {
		const m = minutes % 60;
		const h = (minutes - m) / 60;
		return (h < 10 ? "0" : "") + h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
	}

	static GetPeriodo() {
		const date = new Date();
		return `${date.getFullYear()}-${Math.max(1, Math.round((date.getMonth() + 1) / 6))}`;
	}

	static bloqueToMinutes(bloque: number) {
		return (
			DAY_FIRST_MINUTES +
			BLOQUE_DURATION_MINUTES * (bloque - 1) +
			BREAK_DURATION_MINUTES * Math.floor((bloque - 1) / 2) +
			(bloque > BLOQUE_COMIDA ? BLOQUE_COMIDA_DURATION_MINUTES : 0)
		);
	}

	static bloqueToHHMM(bloque: number) {
		return Time.MinutesToHHMM(Time.bloqueToMinutes(bloque));
	}
}
