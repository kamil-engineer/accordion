type AccordionItem = {
  id: number | string;
  title: string;
  description: string;
  isOpen: boolean;
};

type AccordionItems = AccordionItem[];

const sampleItems: AccordionItems = [
  {
    id: 1,
    title: "What is Frontend Mentor, and how will it help me?",
    description:
      "Frontend Mentor offers realistic coding challenges to help developers improve their frontend coding skills with projects in HTML, CSS, and JavaScript. It’s suitable for all levels and ideal for portfolio building.",
    isOpen: true,
  },
  {
    id: 2,
    title: "Is Frontend Mentor free?",
    description:
      "Frontend Mentor offers realistic coding challenges to help developers improve their frontend coding skills with projects in HTML, CSS, and JavaScript. It’s suitable for all levels and ideal for portfolio building.",
    isOpen: false,
  },
  {
    id: 3,
    title: "Can I use Frontend Mentor projects in my portfolio?",
    description: "Yes",
    isOpen: false,
  },
  {
    id: 4,
    title: "How can I get help if I'm stuck on a challenge?",
    description: "I dont know",
    isOpen: false,
  },
] as const;

type AccordionItemFromConst = (typeof sampleItems)[number];

type AccordionConfig = {
  initialItems?: AccordionItems;
  initiallyOpenIds?: (number | string)[];
  multiOpen?: boolean;
  storageKey?: string;
};

const Accordion = ({
  initialItems = sampleItems,
  initiallyOpenIds = [],
  multiOpen = true,
  storageKey = "accordion-state",
}: AccordionConfig = {}) => {
  const container = document.querySelector<HTMLUListElement>(
    "[data-accordion-list]"
  );
  let restoredItems: AccordionItems | null = null;
  const savedState = localStorage.getItem(storageKey);

  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState) as AccordionItems;
      if (Array.isArray(parsedState)) {
        restoredItems = parsedState;
      }
    } catch (e) {
      console.warn("Accordion: Failed to parse saved state from localStorage.");
    }
  }

  const state = {
    initialItems: restoredItems
      ? restoredItems
      : [...initialItems].map((item) => {
          if (initiallyOpenIds.length > 0) {
            if (multiOpen) {
              return { ...item, isOpen: initiallyOpenIds.includes(item.id) };
            } else {
              return { ...item, isOpen: item.id === initiallyOpenIds[0] };
            }
          }
          return item;
        }),
  };

  if (!container) {
    throw new Error(
      "Accordion error : We can't found accordion list container."
    );
  }

  const renderItem = ({ id, description, title, isOpen }: AccordionItem) => {
    const contentId = `accordion-content-${id}`;
    const buttonId = `accordion-button-${id}`;

    return /* HTML */ `
      <li
        class="accordion__item ${isOpen
          ? "accordion__item--open"
          : "accordion__item--close"}"
        data-accordion-id=${id}
      >
        <button
          class="btn btn--handle"
          id="${buttonId}"
          aria-expanded="${isOpen}"
          aria-controls="${contentId}"
          data-toggle="${id}"
        >
          <span>${title}</span>
          <img
            src="./assets/images/icon-plus.svg"
            alt=""
            aria-hidden="true"
            width="30"
            height="30"
            data-open
          />
          <img
            src="./assets/images/icon-minus.svg"
            alt=""
            aria-hidden="true"
            width="30"
            height="30"
            data-close
          />
        </button>
        <div
          class="accordion__content"
          role="region"
          aria-labelledby="${buttonId}"
          id="${contentId}"
        >
          <p class="accordion__description">${description}</p>
        </div>
      </li>
    `;
  };

  const toggleItem = (id: number) => {
    state.initialItems = state.initialItems.map((item) => {
      if (item.id === id) {
        return { ...item, isOpen: !item.isOpen };
      } else if (!multiOpen) {
        return { ...item, isOpen: false };
      }
      return item;
    });
    render();
  };

  const render = () => {
    container.innerHTML = state.initialItems.map(renderItem).join("");

    state.initialItems.forEach((item) => {
      const button = container.querySelector<HTMLButtonElement>(
        `[data-toggle="${item.id}"]`
      );
      const content = container.querySelector<HTMLDivElement>(
        `#accordion-content-${item.id}`
      );
      if (button && content) {
        button.setAttribute("aria-expanded", String(item.isOpen));
        content.hidden = !item.isOpen;
      }
    });

    localStorage.setItem(storageKey, JSON.stringify(state.initialItems));
  };

  container?.addEventListener("click", (ev) => {
    if (!(ev.target instanceof HTMLElement)) {
      throw new Error("Accordion Click error : Click a non html element.");
    }

    const button = ev.target.closest("[data-toggle]");

    if (!button) {
      throw new Error(
        "Accordion error : Can't find a clickable button as accordion item toggling"
      );
    }

    const managedItem = button.getAttribute("data-toggle");

    if (!managedItem) {
      throw new Error(
        "Accordion error : Button probably have invalid data-toggle attribute."
      );
    }

    toggleItem(Number(managedItem));
  });

  render();
};

Accordion({
  initiallyOpenIds: [1],
  multiOpen: false,
});
