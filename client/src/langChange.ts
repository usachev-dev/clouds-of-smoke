const langSelectClassName = "js-lang-select"
;

export function langChangeInit() {
  let select = document.getElementsByClassName(langSelectClassName)

  each(select, (el) => {
    el.addEventListener("change", (e) => onSelect(e, el as HTMLSelectElement))
  })
}

function each<T extends Element>(collection: HTMLCollectionOf<T>, fn: (el: T) => any) {
  for (let i = 0; i < collection.length; i++) {
    let el = collection[i]
    fn(el)
  }
}

function onSelect(event: Event, select: HTMLSelectElement) {
  location.href = select.value;
}
