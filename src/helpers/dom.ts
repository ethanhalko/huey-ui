export function swapClasses(el: Element[], classA: string, classB: string) {
  el[0].classList.remove(...classA.split(' '));
  el[0].classList.add(...classB.split(' '));
}
