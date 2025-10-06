var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var sampleItems = [
    {
        id: 1,
        title: "What is Frontend Mentor, and how will it help me?",
        description: "Frontend Mentor offers realistic coding challenges to help developers improve their frontend coding skills with projects in HTML, CSS, and JavaScript. It’s suitable for all levels and ideal for portfolio building.",
        isOpen: true,
    },
    {
        id: 2,
        title: "Is Frontend Mentor free?",
        description: "Frontend Mentor offers realistic coding challenges to help developers improve their frontend coding skills with projects in HTML, CSS, and JavaScript. It’s suitable for all levels and ideal for portfolio building.",
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
];
var Accordion = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.initialItems, initialItems = _c === void 0 ? sampleItems : _c, _d = _b.initiallyOpenIds, initiallyOpenIds = _d === void 0 ? [] : _d, _e = _b.multiOpen, multiOpen = _e === void 0 ? true : _e, _f = _b.storageKey, storageKey = _f === void 0 ? "accordion-state" : _f;
    var container = document.querySelector("[data-accordion-list]");
    var restoredItems = null;
    var savedState = localStorage.getItem(storageKey);
    if (savedState) {
        try {
            var parsedState = JSON.parse(savedState);
            if (Array.isArray(parsedState)) {
                restoredItems = parsedState;
            }
        }
        catch (e) {
            console.warn("Accordion: Failed to parse saved state from localStorage.");
        }
    }
    var state = {
        initialItems: restoredItems
            ? restoredItems
            : __spreadArray([], initialItems, true).map(function (item) {
                if (initiallyOpenIds.length > 0) {
                    if (multiOpen) {
                        return __assign(__assign({}, item), { isOpen: initiallyOpenIds.includes(item.id) });
                    }
                    else {
                        return __assign(__assign({}, item), { isOpen: item.id === initiallyOpenIds[0] });
                    }
                }
                return item;
            }),
    };
    if (!container) {
        throw new Error("Accordion error : We can't found accordion list container.");
    }
    var renderItem = function (_a) {
        var id = _a.id, description = _a.description, title = _a.title, isOpen = _a.isOpen;
        var contentId = "accordion-content-".concat(id);
        var buttonId = "accordion-button-".concat(id);
        return /* HTML */ "\n      <li\n        class=\"accordion__item ".concat(isOpen
            ? "accordion__item--open"
            : "accordion__item--close", "\"\n        data-accordion-id=").concat(id, "\n      >\n        <button\n          class=\"btn btn--handle\"\n          id=\"").concat(buttonId, "\"\n          aria-expanded=\"").concat(isOpen, "\"\n          aria-controls=\"").concat(contentId, "\"\n          data-toggle=\"").concat(id, "\"\n        >\n          <span>").concat(title, "</span>\n          <img\n            src=\"./assets/images/icon-plus.svg\"\n            alt=\"\"\n            aria-hidden=\"true\"\n            width=\"30\"\n            height=\"30\"\n            data-open\n          />\n          <img\n            src=\"./assets/images/icon-minus.svg\"\n            alt=\"\"\n            aria-hidden=\"true\"\n            width=\"30\"\n            height=\"30\"\n            data-close\n          />\n        </button>\n        <div\n          class=\"accordion__content\"\n          role=\"region\"\n          aria-labelledby=\"").concat(buttonId, "\"\n          id=\"").concat(contentId, "\"\n        >\n          <p class=\"accordion__description\">").concat(description, "</p>\n        </div>\n      </li>\n    ");
    };
    var toggleItem = function (id) {
        state.initialItems = state.initialItems.map(function (item) {
            if (item.id === id) {
                return __assign(__assign({}, item), { isOpen: !item.isOpen });
            }
            else if (!multiOpen) {
                return __assign(__assign({}, item), { isOpen: false });
            }
            return item;
        });
        render();
    };
    var render = function () {
        container.innerHTML = state.initialItems.map(renderItem).join("");
        state.initialItems.forEach(function (item) {
            var button = container.querySelector("[data-toggle=\"".concat(item.id, "\"]"));
            var content = container.querySelector("#accordion-content-".concat(item.id));
            if (button && content) {
                button.setAttribute("aria-expanded", String(item.isOpen));
                content.hidden = !item.isOpen;
            }
        });
        localStorage.setItem(storageKey, JSON.stringify(state.initialItems));
    };
    container === null || container === void 0 ? void 0 : container.addEventListener("click", function (ev) {
        if (!(ev.target instanceof HTMLElement)) {
            throw new Error("Accordion Click error : Click a non html element.");
        }
        var button = ev.target.closest("[data-toggle]");
        if (!button) {
            throw new Error("Accordion error : Can't find a clickable button as accordion item toggling");
        }
        var managedItem = button.getAttribute("data-toggle");
        if (!managedItem) {
            throw new Error("Accordion error : Button probably have invalid data-toggle attribute.");
        }
        toggleItem(Number(managedItem));
    });
    render();
};
Accordion({
    initiallyOpenIds: [1],
    multiOpen: false,
});
