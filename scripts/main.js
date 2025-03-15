let floatTextContainer;

Hooks.once("init", () => {
  // Register module settings
  game.settings.register("limbus-style-text", "phrases", {
    name: "Phrases",
    hint: "Enter phrases separated by newlines",
    scope: "world",
    config: true,
    type: String,
    default: "REGRET\nFUTILITY\nHUMANITY",
    onChange: () => {}
  });

  game.settings.register("limbus-style-text", "textSettings", {
    name: "Text Settings",
    scope: "world",
    config: true,
    type: Object,
    default: {
      fontFamily: "Arial",
      fontSize: 48,
      textColor: "#ffffff"
    },
    onChange: () => {}
  });
});

Hooks.once("ready", () => {
  // Create container for floating text
  floatTextContainer = document.createElement("div");
  floatTextContainer.id = "float-text-container";
  document.body.appendChild(floatTextContainer);
});

class FloatTextApplication extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Spawn Text",
      template: "templates/apps/float-text.html",
      popout: true,
      width: 400
    });
  }

  getData() {
    return {
      phrases: game.settings.get("limbus-style-text", "phrases").split("\n")
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".spawn-text").click(ev => {
      const phrase = ev.currentTarget.dataset.phrase;
      spawnFloatingText(phrase);
    });
  }
}

function spawnFloatingText(text) {
  if (!game.user.isGM) return;

  const textSettings = game.settings.get("limbus-style-text", "textSettings");
  const textElement = document.createElement("div");
  textElement.className = "floating-text";
  
  // Random position with 90% screen containment
  const x = Math.random() * (window.innerWidth * 0.8) + (window.innerWidth * 0.1);
  const y = Math.random() * (window.innerHeight * 0.8) + (window.innerHeight * 0.1);
  
  // Random rotation between -15 and 15 degrees
  const rotation = (Math.random() * 30) - 15;
  
  Object.assign(textElement.style, {
    left: `${x}px`,
    top: `${y}px`,
    transform: `rotate(${rotation}deg)`,
    color: textSettings.textColor,
    fontSize: `${textSettings.fontSize}px`,
    fontFamily: textSettings.fontFamily
  });

  textElement.textContent = text;
  floatTextContainer.appendChild(textElement);

  // Remove element after animation
  setTimeout(() => {
    textElement.remove();
  }, 4000);
}

Hooks.on("getSceneControlButtons", controls => {
  if (game.user.isGM) {
    controls.push({
      name: "Floating Text",
      title: "Floating Text Controls",
      icon: "fas fa-comment",
      layer: "floatText",
      tools: [{
        icon: "fas fa-plus",
        name: "spawn",
        title: "Spawn Text",
        onClick: () => new FloatTextApplication().render(true)
      }]
    });
  }
});