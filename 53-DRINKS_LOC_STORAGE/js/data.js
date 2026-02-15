// js/data.js
// функция инициализации базы (если localStorage пустой)

function seedDefaults(drinkStorage, foodStorage) {

    if ( drinkStorage.getKeys().length === 0) {
        drinkStorage.addValue("Мохито", {
            alco: true,
            recipe: "Мята, лайм, сахар, ром, содовая, лёд.",
        });

        drinkStorage.addValue("Лимонад", {
            alco: false,
            recipe: "Лимонный сок, сахар, вода, лёд.",
        });

        drinkStorage.addValue("Эспрессо", {
            alco: false,
            recipe: "18–20 г кофе, 25–30 мл.",
        });
    }

    if (foodStorage.getKeys().length === 0) {
        foodStorage.addValue("Омлет", {
            recipe: "Яйца, соль, молоко. Обжарить.",
        });

        foodStorage.addValue("Салат Цезарь", {
            recipe: "Салат, курица, соус, сухари.",
        });
        foodStorage.addValue("Паста", {
            recipe: "Отварить пасту, добавить соус.",
        });
    }
}