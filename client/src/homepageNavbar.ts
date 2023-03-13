import {throttle} from "lodash";

const navbarClassName = "navbar",
  heroClassName = "hero",
  navbarBlackClass = "is-black",
  navbarLightClass = "is-light",
  navbarAnimationClass = "navbar-animation"
;

export function homepageNavbarInit() {
  let navbars = document.getElementsByClassName(navbarClassName)
  let navbar = navbars[0]
  let heroes = document.getElementsByClassName(heroClassName)
  if (!heroes || heroes.length == 0) {
    return
  }
  let hero = heroes[0]
  onScroll(navbar, hero)
  navbar.classList.add(navbarAnimationClass)
  document.addEventListener("scroll", throttle(() => onScroll(navbar, hero), 300))
}


function onScroll(navbar: Element, hero: Element) {
  if (isInViewport(hero)) {
    navbar.classList.add(navbarBlackClass)
    navbar.classList.remove(navbarLightClass)
  } else {
    navbar.classList.add(navbarLightClass)
    navbar.classList.remove(navbarBlackClass)
  }
}

function isInViewport(element: Element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.top < (window.innerHeight || document.documentElement.clientHeight)
  );
}
