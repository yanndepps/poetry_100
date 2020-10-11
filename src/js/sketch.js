import Sketch from "./app.js";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const sketch = new Sketch({
  dom: document.getElementById("container"),
  fragment: fragment,
  vertex: vertex,
});

const wrap = document.getElementById("wrapper");

gsap.to(sketch.settings, {
  duration: 3,
  progress: 1,
  ease: "expo.inOut",
});

gsap.to(wrap, {
  // x: "-1000px",
  x: -(wrap.scrollWidth - document.documentElement.clientWidth) + "px",
  scrollTrigger: {
    trigger: "#container",
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      // console.log(self);
      sketch.time = self.progress * 40;
    },
  },
});
