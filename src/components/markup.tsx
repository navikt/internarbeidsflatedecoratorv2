import React from 'react';
import { MaybeCls } from '@nutgaard/maybe-ts';

interface Props {
    markup?: string;
}

function Markup(props: Props) {
    return MaybeCls.of(props.markup)
        .map((markup) => <div dangerouslySetInnerHTML={{ __html: markup }} />)
        .withDefault(null);
}

export default Markup;
