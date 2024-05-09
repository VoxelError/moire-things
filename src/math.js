export const { PI: pi, sin, cos, abs, sqrt, random, floor } = Math

export const degrees = (num) => (num * pi) / 180
export const to_degrees = (num) => (num * 180) / pi
export const sin_wave = (theta, amplitude = 1, v_shift = 0, frequency = 1, phase = 0) => amplitude * sin(frequency * (theta - phase)) + v_shift
export const cos_wave = (theta, amplitude = 1, v_shift = 0, frequency = 1, phase = 0) => amplitude * cos(frequency * (theta - phase)) + v_shift