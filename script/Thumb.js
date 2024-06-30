export class Thumb {
  static preventDefaultEventList = [
    'mousemove',
    'dragstart',
    'selectstart',
    'contextmenu',
    'touchstart',
    'touchmove',
    'touchend',
    'wheel',
  ];

  static preventDefaultHandler = (e) => {
    e.preventDefault();
  };

  constructor(containerSelector, draggableSelector, connection) {
    this.container = document.body.querySelector(containerSelector);
    this.draggable = document.body.querySelector(draggableSelector);
    this.connection = connection;
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.pos = { x: 0, y: 0 };
    this.callbacks = [];
    this.init();
  }

  init() {
    this.draggable.addEventListener('pointerdown', this.onPointerDown);
  }

  addCallback = (callback, when) => {
    this.callbacks.push({ callback: callback, when: when });
  };

  setPosByNormal = (x, y) => {
    this.pos.x = (this.container.clientWidth - this.draggable.clientWidth) * x;
    this.pos.y =
      (this.container.clientHeight - this.draggable.clientHeight) * y;

    this.connection.forEach((v, k) => {
      document.documentElement.style.setProperty(
        this.container.dataset[`${k}`],
        `${this.pos[`${v}`]}`
      );
    });
  };

  onPointerDown = (e) => {
    if (e.target !== this.draggable && !this.draggable.contains(e.target))
      return;
    this.isDragging = true;
    this.draggable.classList.add('pressed');

    document.body.style.cursor = 'grabbing';

    this.offset.x = e.clientX - this.draggable.getBoundingClientRect().left;
    this.offset.y = e.clientY - this.draggable.getBoundingClientRect().top;

    this.dragging(e);

    this.preventDefaultEvents();
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);

    if (this.callbacks.length === 0) return;
    this.callbacks
      .filter((elem) => {
        return elem.when === 'start';
      })
      .forEach((elem) => {
        elem.callback(this);
      });
  };

  dragging = (e) => {
    this.pos.x =
      e.clientX - this.container.getBoundingClientRect().left - this.offset.x;
    this.pos.y =
      e.clientY - this.container.getBoundingClientRect().top - this.offset.y;

    this.pos.x = Math.max(
      0,
      Math.min(
        this.pos.x,
        this.container.clientWidth - this.draggable.clientWidth
      )
    );
    this.pos.y = Math.max(
      0,
      Math.min(
        this.pos.y,
        this.container.clientHeight - this.draggable.clientHeight
      )
    );

    this.connection.forEach((v, k) => {
      document.documentElement.style.setProperty(
        this.container.dataset[`${k}`],
        `${this.pos[`${v}`]}`
      );
    });
  };

  preventDefaultEvents = () => {
    Thumb.preventDefaultEventList.forEach((eventName) => {
      if (eventName !== 'touchmove' && eventName !== 'wheel') {
        document.addEventListener(eventName, Thumb.preventDefaultHandler);
      } else {
        document.addEventListener(eventName, Thumb.preventDefaultHandler, {
          passive: false,
        });
      }
    });
  };

  allowDefaultEvents = () => {
    Thumb.preventDefaultEventList.forEach((eventName) => {
      if (eventName !== 'touchmove' && eventName !== 'wheel') {
        document.removeEventListener(eventName, Thumb.preventDefaultHandler);
      } else {
        document.removeEventListener(eventName, Thumb.preventDefaultHandler, {
          passive: false,
        });
      }
    });
  };

  onPointerMove = (e) => {
    if (!this.isDragging) return;
    this.dragging(e);

    if (this.callbacks.length === 0) return;
    this.callbacks
      .filter((elem) => {
        return elem.when === 'during';
      })
      .forEach((elem) => {
        elem.callback(this);
      });
  };

  onPointerUp = (e) => {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.draggable.classList.remove('pressed');

    document.body.style.cursor = 'auto';

    this.dragging(e);

    this.allowDefaultEvents();
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);

    if (this.callbacks.length === 0) return;
    this.callbacks
      .filter((elem) => {
        return elem.when === 'end';
      })
      .forEach((elem) => {
        elem.callback(this);
      });
  };

  getNormal() {
    return {
      x: this.pos.x / (this.container.clientWidth - this.draggable.clientWidth),
      y:
        this.pos.y /
        (this.container.clientHeight - this.draggable.clientHeight),
    };
  }
}
