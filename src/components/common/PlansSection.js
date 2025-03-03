import React, {useContext} from 'react';
import AppContext from '../../AppContext';
import calculateDiscount from '../../utils/discount';
import {isCookiesDisabled, formatNumber, hasOnlyFreePlan} from '../../utils/helpers';

export const PlanSectionStyles = `
    .gh-portal-plans-container {
        display: flex;
        align-items: stretch;
        border: 1px solid var(--grey10);
        border-radius: 5px;
    }

    .gh-portal-plan-section {
        display: flex;
        flex-direction: column;
        flex: 1;
        position: relative;
        align-items: center;
        justify-items: center;
        font-size: 1.4rem;
        line-height: 1.35em;
        border-right: 1px solid var(--grey10);
        padding: 16px 10px;
        cursor: pointer;
        user-select: none;
    }

    .gh-portal-plans-container.disabled .gh-portal-plan-section {
        cursor: auto;
    }

    .gh-portal-plan-section.checked::before {
        position: absolute;
        display: block;
        top: -1px;
        right: -1px;
        bottom: -1px;
        left: -1px;
        content: "";
        z-index: 999;
        border: 2px solid var(--brandcolor);
        pointer-events: none;
    }

    .gh-portal-plan-section:first-of-type::before {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .gh-portal-plan-section:last-of-type::before {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .gh-portal-plan-section:last-of-type {
        border-right: none;
    }

    .gh-portal-plans-container.disabled .gh-portal-plan-section.checked::before {
        opacity: 0.3;
    }

    .gh-portal-plan-pricelabel {
        display: flex;
        flex-direction: row;
        min-height: 28px;
        margin-top: 2px;
    }

    .gh-portal-plan-pricecontainer {
        display: flex;
    }

    .gh-portal-plan-priceinterval {
        font-size: 1.25rem;
        line-height: 2;
        color: var(--grey7);
    }

    .gh-portal-plan-name {
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.0em;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-top: 7px;
        text-align: center;
        min-height: 24px;
        word-break: break-word;
    }

    .gh-portal-plan-currency {
        position: relative;
        bottom: 2px;
        font-size: 1.4rem;
        font-weight: 500;
        letter-spacing: 0.4px;
    }

    .gh-portal-plan-currency-code {
        margin-right: 2px;
        font-size: 1.15rem;
    }

    .gh-portal-plan-price {
        font-size: 2.2rem;
        font-weight: 500;
        letter-spacing: 0.1px;
    }

    .gh-portal-plan-type {
        color: var(--grey7);
    }

    .gh-portal-plan-featurewrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-top: 1px solid var(--grey12);
        padding-top: 12px;
        width: 100%;
    }

    .gh-portal-plan-feature {
        font-size: 1.25rem;
        font-weight: 500;
        line-height: 1.25em;
        text-align: center;
        letter-spacing: 0.2px;
        word-break: break-word;
    }

    .gh-portal-plan-checkbox {
        position: relative;
        display: block;
        font-size: 22px;
        height: 18px;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .gh-portal-plans-container.disabled .gh-portal-plan-checkbox {
        cursor: auto;
    }

    .gh-portal-plan-checkbox input {
        position: absolute;
        height: 0;
        width: 0;
        opacity: 0;
        cursor: pointer;
    }

    .gh-portal-plan-checkbox .checkmark {
        position: absolute;
        top: 0;
        left: -9px;
        background-color: var(--grey12);
        border-radius: 999px;
        height: 18px;
        width: 18px;
    }

    .gh-portal-plan-checkbox input:checked ~ .checkmark {
        background-color: var(--brandcolor);
    }

    .gh-portal-plan-checkbox .checkmark::after {
        position: absolute;
        display: none;
        content: "";
    }

    .gh-portal-plan-checkbox input:checked ~ .checkmark:after {
        display: block;
    }

    .gh-portal-plan-checkbox .checkmark:after {
        left: 6.5px;
        top: 2.5px;
        width: 5px;
        height: 11px;
        border: solid var(--white);
        border-width: 0 2px 2px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }

    .gh-portal-plans-container.disabled .gh-portal-plan-checkbox input:checked ~ .checkmark {
        opacity: 0.3;
    }

    .gh-portal-content.signup.singleplan .gh-portal-plan-section {
        cursor: auto;
    }

    .gh-portal-content.signup.singleplan .gh-portal-plan-checkbox,
    .gh-portal-content.signup.singleplan .gh-portal-plan-section.checked::before {
        display: none;
    }

    .gh-portal-content.signup.singleplan .gh-portal-plan-name {
        margin-top: 0;
    }

    .gh-portal-plan-section:not(.checked)::before {
        position: absolute;
        display: block;
        top: -1px;
        right: -1px;
        bottom: -1px;
        left: -1px;
        content: "";
        z-index: 999;
        border: 1px solid var(--brandcolor);
        pointer-events: none;
        opacity: 0;
        transition: all 0.2s ease-in-out;
    }

    .gh-portal-plans-container.disabled .gh-portal-plan-section:not(.checked):hover::before {
        opacity: 0;
    }

    .gh-portal-plans-container.hide-checkbox .gh-portal-plan-checkbox {
        display: none;
    }

    .gh-portal-plans-container.hide-checkbox .gh-portal-plan-section {
        padding-top: 12px;
        padding-bottom: 12px;
    }

    .gh-portal-plan-current {
        display: block;
        font-size: 1.25rem;
        letter-spacing: 0.2px;
        line-height: 1.25em;
        color: var(--brandcolor);
        margin: 4px 0 -2px;
    }

    .gh-portal-plans-container.vertical {
        flex-direction: column;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-section {
        display: grid;
        flex-direction: unset;
        grid-template-columns: 32px auto auto;
        grid-template-rows: auto auto;
        justify-items: start;
        min-height: 60px;
        border-right: none;
        border-bottom: 1px solid var(--grey10);
        padding: 10px;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-checkbox {
        grid-column: 1 / 2;
        grid-row: 1 / 3;
        margin: 0 12px;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-pricelabel {
        grid-column: 3 / 4;
        grid-row: 1 / 3;
        flex-direction: column;
        justify-self: end;
        align-items: flex-end;
        margin: 4px 4px 0 12px;
        min-height: unset;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-priceinterval {
        line-height: unset;
        line-height: 1.7;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-name {
        text-transform: none;
        font-size: 1.4rem;
        line-height: 1.1em;
        letter-spacing: 0.2px;
        margin: 0;
        min-height: unset;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-featurewrapper {
        margin: 0;
        padding: 0;
        border: none;
        align-items: flex-start;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-feature {
        text-align: left;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-section:last-of-type {
        border-bottom: none;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-section:first-of-type::before {
        border-radius: 5px 5px 0 0;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-section:last-of-type::before {
        border-radius: 0 0 5px 5px;
    }

    .gh-portal-plans-container.vertical.hide-checkbox .gh-portal-plan-section {
        grid-template-columns: auto auto;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-pricelabel {
        grid-column: 3 / 4;
        grid-row: 1 / 3;
    }

    .gh-portal-plans-container.vertical.hide-checkbox .gh-portal-plan-featurewrapper {
        grid-column: 1 / 2;
    }

    .gh-portal-plans-container.vertical .gh-portal-plan-name.no-description {
        grid-row: 1 / 3;
    }
`;

function Checkbox({name, id, onPlanSelect, isChecked, disabled = false}) {
    if (isCookiesDisabled()) {
        disabled = true;
    }
    return (
        <div className='gh-portal-plan-checkbox'>
            <input
                name={name}
                key={id}
                type="checkbox"
                checked={isChecked}
                aria-label={name}
                onChange={e => onPlanSelect(e, id)}
                disabled={disabled}
            />
            <span className='checkmark'></span>
        </div>
    );
}

function PriceLabel({currencySymbol, price, interval}) {
    const isSymbol = currencySymbol.length !== 3;
    const currencyClass = isSymbol ? 'gh-portal-plan-currency gh-portal-plan-currency-symbol' : 'gh-portal-plan-currency gh-portal-plan-currency-code';
    return (
        <div className='gh-portal-plan-pricelabel'>
            <div className='gh-portal-plan-pricecontainer'>
                <span className={currencyClass}>{currencySymbol}</span>
                <span className='gh-portal-plan-price'>{formatNumber(price)}</span>
            </div>
        </div>
    );
}

function addDiscountToPlans(plans) {
    const filteredPlans = plans.filter(d => d.id !== 'free');
    const monthlyPlan = plans.find((d) => {
        return d.name === 'Monthly' && !d.description && d.interval === 'month';
    });
    const yearlyPlan = plans.find((d) => {
        return d.name === 'Yearly' && !d.description && d.interval === 'year';
    });

    if (filteredPlans.length === 2 && monthlyPlan && yearlyPlan) {
        const discount = calculateDiscount(monthlyPlan.amount, yearlyPlan.amount);
        yearlyPlan.description = discount > 0 ? `${discount}% discount` : '';
    }
}

function PlanOptions({plans, selectedPlan, onPlanSelect, changePlan}) {
    const {site} = useContext(AppContext);
    const {free_price_name: freePriceName, free_price_description: freePriceDescription} = site;
    addDiscountToPlans(plans);
    return plans.map(({name, currency_symbol: currencySymbol, amount, description, interval, id}) => {
        const price = amount / 100;
        const isChecked = selectedPlan === id;
        const classes = (isChecked ? 'gh-portal-plan-section checked' : 'gh-portal-plan-section');
        const planDetails = {};
        let displayName = name;
        switch (name) {
        case 'Free':
            displayName = freePriceName || name;
            planDetails.feature = freePriceDescription || 'Free preview';
            break;
        default:
            planDetails.feature = description || 'Full access';
            break;
        }

        const planNameClass = planDetails.feature ? 'gh-portal-plan-name' : 'gh-portal-plan-name no-description';

        return (
            <div className={classes} key={id} onClick={e => onPlanSelect(e, id)}>
                <Checkbox name={name} id={id} isChecked={isChecked} onPlanSelect={onPlanSelect} />
                <h4 className={planNameClass}>{displayName}</h4>
                <PriceLabel currencySymbol={currencySymbol} price={price} interval={interval} />
                <div className='gh-portal-plan-featurewrapper'>
                    <div className='gh-portal-plan-feature'>
                        {planDetails.feature}
                    </div>
                    {(changePlan && selectedPlan === id ? <span className='gh-portal-plan-current'>Current plan</span> : '')}
                </div>
            </div>
        );
    });
}

function PlanLabel({showLabel}) {
    if (!showLabel) {
        return null;
    }
    return (
        <label className='gh-portal-input-label'>Plan</label>
    );
}

function getPlanClassNames({changePlan, cookiesDisabled, plans}) {
    let className = 'gh-portal-plans-container';
    if (changePlan) {
        className += ' hide-checkbox';
    }
    if (cookiesDisabled) {
        className += ' disabled';
    }
    if (changePlan || plans.length > 3) {
        className += ' vertical';
    }
    return className;
}

function PlansSection({plans, showLabel = true, selectedPlan, onPlanSelect, changePlan = false}) {
    if (hasOnlyFreePlan({plans})) {
        return null;
    }
    const cookiesDisabled = isCookiesDisabled();
    /**Don't allow plans selection if cookies are disabled */
    if (cookiesDisabled) {
        onPlanSelect = () => {};
    }
    const className = getPlanClassNames({cookiesDisabled, changePlan, plans});
    return (
        <section>
            <PlanLabel showLabel={showLabel} />
            <div className={className}>
                <PlanOptions plans={plans} onPlanSelect={onPlanSelect} selectedPlan={selectedPlan} changePlan={changePlan} />
            </div>
        </section>
    );
}

export default PlansSection;
