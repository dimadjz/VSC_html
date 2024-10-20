class PriceCalculator {
    constructor() {
        this.prices = {
            type1: 500,
            type2: 300,
            type3: 300
        };

        this.quantityInput = document.getElementById('quantity');
        this.serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
        this.optionsDiv = document.getElementById('options');
        this.propertiesDiv = document.getElementById('properties');
        this.optionSelect = document.getElementById('optionSelect');
        this.propertyCheckbox = document.getElementById('propertyCheckbox');
        this.totalPriceSpan = document.getElementById('totalPrice');

        this.init();
    }

    init() {
        this.updateVisibility();
        this.addEventListeners();
        this.calculateTotal();
    }

    addEventListeners() {
        this.quantityInput.addEventListener('input', () => this.calculateTotal());
        this.serviceTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateVisibility();
                this.calculateTotal();
            });
        });
        this.optionSelect.addEventListener('change', () => this.calculateTotal());
        this.propertyCheckbox.addEventListener('change', () => this.calculateTotal());
    }

    updateVisibility() {
        const selectedType = this.getSelectedServiceType();

        this.optionsDiv.classList.add('hidden');
        this.propertiesDiv.classList.add('hidden');

        if (selectedType === 'type2') {
            this.optionsDiv.classList.remove('hidden');
        } else if (selectedType === 'type3') {
            this.propertiesDiv.classList.remove('hidden');
        }
    }

    getSelectedServiceType() {
        return Array.from(this.serviceTypeRadios).find(radio => radio.checked).value;
    }

    calculateTotal() {
        const quantity = parseInt(this.quantityInput.value);
        const selectedType = this.getSelectedServiceType();
        let price = this.prices[selectedType];

        if (selectedType === 'type2' && this.optionSelect.value === 'option2') {
            price += 50;
        }

        if (selectedType === 'type3' && this.propertyCheckbox.checked) {
            price += 30;
        }

        const total = price * quantity;
        this.totalPriceSpan.textContent = total;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PriceCalculator();
});
