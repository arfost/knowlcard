import { directive } from 'https://unpkg.com/lit-html@latest/lit-html.js?module';

export const onPushData = directive((ref, content, defaultContent, emptyContent) => part => {
    part.setValue(defaultContent);
    ref.on("value", data => {
        console.log("data", data)
        if (data !== undefined && data !== null) {
            part.setValue(content(data))
        } else if (emptyContent) {
            part.setValue(emptyContent);
        }
        part.commit();
    })
});