export const getPopupInfoTemplate = (data) => {
    const html = `
    <div class="popup-content">
    <div class="header"><div class="title p-1">${data.title}</div><div class="address p-1">${data.address}</div></div>
    <div class="content">
    </div></div>`;
    return html;
};
