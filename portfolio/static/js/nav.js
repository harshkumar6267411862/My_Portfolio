class StickyNavigation {

  constructor() {
    this.currentId = null;
    this.currentTab = null;
    this.tabContainerHeight = 70;

    $('.et-hero-tab').click((event) => {
      this.onTabClick(event, $(event.target));
    });

    $(window).scroll(() => this.onScroll());
    $(window).resize(() => this.onResize());
  }

  onTabClick(event, element) {
    event.preventDefault();
    let scrollTop = $(element.attr('href')).offset().top - this.tabContainerHeight + 1;
    $('html, body').animate({ scrollTop: scrollTop }, 600);
  }

  onScroll() {
    this.checkTabContainerPosition();
    this.findCurrentTabSelector();
  }

  onResize() {
    if (this.currentId) {
      this.setSliderCss();
    }
  }

  checkTabContainerPosition() {
    let offset = $('.et-hero-tabs').offset().top +
      $('.et-hero-tabs').height() - this.tabContainerHeight;

    if ($(window).scrollTop() > offset) {
      $('.et-hero-tabs-container').addClass('et-hero-tabs-container--top');
    } else {
      $('.et-hero-tabs-container').removeClass('et-hero-tabs-container--top');
    }
  }

  findCurrentTabSelector() {
    let newCurrentId;
    let newCurrentTab;

    $('.et-hero-tab').each((index, element) => {
      let id = $(element).attr('href');
      let offsetTop = $(id).offset().top - this.tabContainerHeight;
      let offsetBottom = offsetTop + $(id).height();

      if ($(window).scrollTop() > offsetTop &&
        $(window).scrollTop() < offsetBottom) {
        newCurrentId = id;
        newCurrentTab = $(element);
      }
    });

    if (this.currentId !== newCurrentId) {
      this.currentId = newCurrentId;
      this.currentTab = newCurrentTab;
      this.setSliderCss();
    }
  }

  setSliderCss() {
    if (!this.currentTab) return;

    let width = this.currentTab.outerWidth();
    let left = this.currentTab.position().left;

    $('.et-hero-tab-slider').css({
      width: width,
      left: left
    });
  }
}

$(document).ready(() => {
  new StickyNavigation();
});
