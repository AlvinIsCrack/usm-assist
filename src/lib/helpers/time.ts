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
}
