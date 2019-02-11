import { directive } from 'https://unpkg.com/lit-html@latest/lit-html.js?module';

export const onPushData = directive((ref, content, defaultContent, emptyContent) => part => {
    part.setValue(defaultContent);
    ref.on("value", snap => {
        let data = snap.val();
        if (data !== undefined && data !== null) {
            part.setValue(content(data))
        } else if (emptyContent) {
            part.setValue(emptyContent);
        }
    })

});
export const onPushList = directive((ref, content, defaultContent, emptyContent) => part => {
    part.setValue(defaultContent);
    ref.on("value", snap => {
        let data = snap.val();
        console.log(data)
        if (data) {
            data = [...data.keys()];
            console.log(data)
            part.setValue(content(data));
        } else if (emptyContent) {
            part.setValue(emptyContent);
        }
        part.commit()
    })
});