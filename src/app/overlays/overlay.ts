
import 'ol-popup/src/ol-popup.css';
import { IPollutionModel } from '../components/models/pollution.interface';
import { IDataModelItem } from '../components/models/data-model-item.interface';
import { IObjectInfo } from '../components/models/obj-info.interface';

const getTemplate = (data: IDataModelItem,
    emissions: string,
    concentrations: string,
    dimEm: string,
    dimConc: string,
    info: string) => `
<div class="popup-content">
<div class="header">
    <div class="flex-row justify-content-start align-self-center">
        <div class="info-image">
            <img src="${data.information.imgUrl}" alt="" class="profile-pic">
        </div>
        <div class="p-2">
            <div class="title p-1">${data.title}</div>
            <div class="address p-1">${data.address}</div>
        </div>
    </div>
</div>
<div class="content">
<div class="tab">
<button class="tablinks" onclick="openTab(event, 'objemissions')">Выбросы</button>
<button class="tablinks" onclick="openTab(event, 'objconcentrations')">Концентрация</button>
<button class="tablinks" onclick="openTab(event, 'objinformation')">Информация</button>
<button class="tablinks" onclick="openTab(event, 'objreports')">Отчеты</button>
</div>

<div id="objemissions" class="tabcontent">
<div class="subtitle">Выбросы загрязняющих веществ, ${dimEm}</div>
${emissions}
${getDateString(data.datetime)}
</div>


<div id="objconcentrations" class="tabcontent">
<div class="subtitle">Концентрации загрязняющих веществ, ${dimConc}</div>
${concentrations}
${getDateString(data.datetime)}
</div>


<div id="objinformation" class="tabcontent">
    <div class="info-block">${info}</div>
</div></div></div>

<div id="objreports" class="tabcontent" style="background: white;">
<div class="flex-row">
    <a href="reports/${data.id}">Отчеты по объекту</a>
</div>
</div></div></div>`;

const getTabled = (arr: IPollutionModel[]) => {
    let table = `<table class="pollution-table">`;
    arr.forEach(el => {
        table += `<tr><td>${el.name} (${el.desc})</td><td>${el.value}</td></tr>`;
    });

    table += '</table>';
    return table;
};

const getInfo = (info: IObjectInfo): string => {
    let html = `<div class="subtitle">${info.description}</div>`;
    html += info.function ? `<div class="function">Назначение системы: ${info.function}</div>` : '';
    html += info.contentHeader ? `<div class="function">${info.contentHeader}</div>` : '';
    html += '<ul class="info-items">';
    info.content.forEach(item => {
        html += `<li class="info-item">${item}</li>`;
    });
    html += '</ul>';
    return html;
};

const getDateString = (date: string) => {
    return `<div class="flex-row"><div class="datetime">Обновлено: </div><div class="datetime-value">${date}</div></div>`;
};

export const getPopupWindow = (data: IDataModelItem, options: any) => {

    const emissions = getTabled(data.emissions);
    const conc = getTabled(data.concentrations);
    const info = getInfo(data.information);

    return getTemplate(data, emissions, conc, options.dimEm, options.dimConc, info);
};

