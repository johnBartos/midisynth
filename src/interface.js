import Two from 'two.js';

const element = document.querySelector('.interface');
const params = {
  width: 300,
  height: 300
};
const two = new Two(params).appendTo(element);

const circle = two.makeCircle(72, 100, 50);
circle.fill = "red";

two.update();



export {};
