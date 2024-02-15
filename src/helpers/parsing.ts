export function getModifierFromClassList(classes: string, classType: string) {
  const target = classes.split(' ').find((c) => c.includes(classType))?.split('-').reverse();

  if (!target) {
    return;
  }

  try {
    return parseInt(target[0]);
  } catch (e) {
    console.error(e, 'Provided class has no valid modifier');
  }
}
