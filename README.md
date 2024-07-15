# Introduction
A showcasing of various simulations using the HTML5 Canvas API. Hosted over on [moire-things.netlify.app](https://moire-things.netlify.app).

Please note that this project is in an alpha state. It is recommended to try it out on Google Chrome, or a browser that uses Chromium.

![Moire](https://github.com/user-attachments/assets/f5af2c1e-a2bf-481e-b77c-093dc15ef84a)

# Overview
Upon entering the site, you will be greeted with a blank canvas, and a user interface on the upper-right of the screen.

<br>

**In summary:**
- Draw modes are like special paint brushes (with some exceptions), and can be changed using the "mode" dropdown.
- Most draw modes are animated in some way, and can be paused using the "pause" toggle.
- A number of draw modes use the mouse to draw points. Some modes have a predefined set of points that you can add, using the "plot" button.
- Finally, the "reset" button will clear the canvas, reset time, and erase all points.

# Modes
A more in-depth explanation of each mode can be read below:

<details>
  <summary><b>Ball</b></summary>
  
  > Plot: ❌
  <br>
  > Interactive: ✔

  > A set of 100 balls that simulate gravity, damping, and traction. The set has a uniform distribution of damping values between 0.7 and 0.9 (smaller value = less bouncy).
  
  > <b>Left click</b> to drop the set of balls where you clicked. <b>Hold</b> left click, <b>drag</b> in a direction, and <b>release</b> left click to launch the set in the direction of your mouse. The farther your mouse, the faster the launch.
  
  > <b>Right click</b> to momentarily halt the momentum of every ball. <b>Hold, drag, and release</b> right click to launch all balls in the direction of the mouse, but relative to where they are. For instance, dragging up will launch all balls straight and upwards. The distance of the drag matters here, too.

  > Note that clicking anywhere on the gui panel will drop the whole set from the center of the screen.
</details>

<details>
  <summary><b>Bounce</b></summary>
  
  > Plot: ❌
  <br>
  > Interactive: ✔
   
  > <b>Hold left click</b> to draw slow-moving circles. These move diagonally, and will travel down and right initially. Upon colliding with a wall, a circle will <b>bounce</b> in the perpendicular direction.
</details>

<details>
  <summary><b>Cells</b></summary>
  
  > Plot: ❌
  <br>
  > Interactive: ❌
   
  > A large set of tightly-packed, concentric rings. These rings are drawn with dashed lines, and display harmonic properties by modulating the offsets of these lines.
</details>

# Remarks
- While hovering the mouse over the closed mode dropdown, you can use the scroll wheel to scroll through different modes.
- Note that everything is reset when switching modes, just as if you pressed the "reset" button. This feature prevents incredibly glitchy behavior when transferring points to different modes.
- Some modes are computationally heavy, and have not been fully optimized yet. As well, there is currently no limit to how many points you can add. I am currently working on re-implementing the app using the WebGPU API, which could drastically improve performance.
