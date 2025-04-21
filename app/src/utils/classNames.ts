// src/utils/classNames.ts
const cx = (...classes: (string | false | null | undefined)[]) =>
    classes.filter(Boolean).join(' ');

export default cx;
