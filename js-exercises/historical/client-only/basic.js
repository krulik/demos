'use strict';

request('ancestry.json', onAncestryData);


function onAncestryData(ancestry) {
    document.body.appendChild(barChart({
        title: 'Historical Life Expectancy',
        label: v => `${withSuffix(v)} Century`,
        series: getHistoricalAverage(ancestry),
        percent: v => (v / 130) * 100
    }));

    document.body.appendChild(barChart({
        title: 'Age of Death Histogram',
        label: v => `Died at age ${v}`,
        series: getDiedHistogram(ancestry),
        percent: (v, series) => Math.ceil((v / Object.keys(series).length) * 100)
    }));
}

function getHistoricalAverage(ancestry) {
    let diedAge = person => person.died - person.born;
    let century = person => Math.ceil(person.died / 100);
    let grouped = groupBy(ancestry, century);
    return groupReduce(grouped, average, diedAge);
}


function getDiedHistogram(ancestry) {
    let diedAge = person => person.died - person.born;
    let grouped = groupBy(ancestry, diedAge);
    return groupReduce(grouped, count, v => v);
}

function groupReduce(group, method, normalize) {
    return Object.keys(group).reduce((hash, key) => {
        hash[key] = method(group[key].map(normalize));
        return hash;
    }, {});
}

function count(list) {
    return list.length;
}

function average(list, precision = 1) {
    return (sum(list) / list.length).toFixed(precision);
}

function sum(list) {
    return (list.reduce((sum, val) => sum + val));
}

function withSuffix(ordinal) {
    let right = String(ordinal).split('').pop();
    switch (right) {
        case '1':
            return `${ordinal}st`;
        case '2':
            return `${ordinal}nd`;
        case '3':
            return `${ordinal}3d`;
        default:
            return `${ordinal}th`;
    }
}

function barChart({title, label, series, percent}) {
    let barChart = document.createElement('div');
    barChart.classList.add('BarChart');
    barChart.innerHTML = `
        <h2 class="BarChart-title">${title}</h2>
        <dl class="BarChart-graph">
            ${Object.keys(series).sort((a, b) => a - b).map(bar).join('')}
        </dl>
    `;
    return barChart;

    function bar(category) {
        let color = getColor(category);
        let value = series[category];
        return `
            <dt class="BarChart-category">${label(category)}</dt>
            <dd class="BarChart-value">
                <data style="width: ${percent(value, series)}%;" class="bg-${color.bg} ${color.text}">${value}</data>
            </dd>
        `;
    }

    function getColor(category) {
        let colors = [
            {bg: 'yellow', text: 'navy'},
            {bg: 'fuchsia', text: 'white'},
            {bg: 'orange', text: 'black'},
            {bg: 'maroon', text: 'white'},
            {bg: 'red', text: 'white'},
            {bg: 'aqua', text: 'navy'}
        ];
        if (!getColor.index) {
            getColor.index = 0;
        }
        return colors[(getColor.index++) % colors.length];
    }
}

function groupBy(list, method) {
    let hash = new Map();
    for (let value of list) {
        let key = method(value);
        if (hash[key]) {
            hash[key].push(value);
            continue;
        }
        hash[key] = [value];
    }
    return hash;
}

function request(url, resolve) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.addEventListener('load', e => resolve(JSON.parse(e.target.responseText)));
    xhr.send();
}