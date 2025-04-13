# Introduction

A showcasing of various graphics and simulations, using the WebGPU API. Hosted over on [moire-things.netlify.app](https://moire-things.netlify.app).

Please note that this project is in an alpha state. It is also recommended to try it out on Google Chrome, or a browser that uses Chromium.

![Screenshot 2024-08-26 160217](https://github.com/user-attachments/assets/9e4c5d94-2a74-4a67-8aea-8a48978bb614)

# Overview

The sidebar to the left contains a list of modes to choose from. On the top-right is a user interface with buttons and sliders. The rest of the screen is the canvas.

A more in-depth explanation of each mode and their menus can be read below.

# Modes

### Ball

> A set of 100 balls that simulate gravity, damping, and traction. The set has a uniform distribution of damping values between 0.8 and 0.9 (less damping means more bounciness).
>
> <b>Left click</b> to drop the set of balls where you clicked. <b>Hold</b> left click, <b>drag</b> in a direction, and <b>release</b> left click to launch the set in the direction of your cursor. The farther your cursor, the faster the launch.
>
> <b>Right click</b> to momentarily halt the momentum of every ball. <b>Hold, drag, and release</b> right click to launch all balls in the direction of the cursor, but relative to where they are. For instance, dragging up will launch all balls straight and upwards. The distance of the drag matters here, too.

> Wrap: Disables left and right walls, and wraps around to the other side of the screen.<br>
> Gravity: Adjusts gravitational constant (0 - 9.8).

### Bubbles

> <b>Hold left click</b> to draw animated bubbles, that grow and shrink sinusoidally.

> Clear: Removes all bubbles.<br>
> Undo: Removes the most recent bubble.<br>
> Reset: Resets the sliders and toggles.<br>
> Colors: Toggles whether colors show or not.<br>
> Speed: Adjusts rate of time.<br>
> Radius: Adjusts bubble size.<br>
> Sectus: Adjusts the inner radius, as a coefficient of the radius (0 - 0.96).<br>
> Sectors: Adjusts how many edges the circle has (3 -33).

### Compass

> A grid of pointers covering the screen, facing towards the cursor.

> Facing: Toggles whether pointers face towards or away from the cursor.

### Conway

> A simulation of Conways Game of Life, with standard rules. Cells are brighter the more neighbors they have.

> Restart: Starts a new and random simulation.

### Fins

> <b>Hold left click</b> to draw colorful, rotating lines.
>
> Clear: Removes all fins.

### Orbs

> <b>Hold left click</b> to draw colorful, swinging orbs. Orbs grow and shrink over time.

> Clear: Removes all orbs.

### Pendulum

> Simulates pendulums with realistic motion. <b>Hold left click</b> continuously draws pendulums, and <b>right click</b> draws a single pendulum.

> Clear: Removes all pendulums.

### Spikes

> Spikes that reach towards the cursor. <b>Hold left click</b> to draw continuously, and press <b>right click</b> to draw a single spike.

> Clear: Removes all spikes.

### Teeth

> Spinning circles with spikes, that grow and shrink. <b>Hold left click</b> to draw continuously, and press <b>right click</b> to draw a single circle.

> Clear: Removes all circles.<br>
> Undo: Removes the most recent circle.<br>
> Reset: Resets the sliders and toggles.<br>
> Radius: Adjusts circle size.<br>
> Teeth: Adjusts how many teeth each circle has (3 - 16).
