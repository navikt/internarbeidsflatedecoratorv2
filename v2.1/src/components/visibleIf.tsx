import * as React from 'react';

type Props<T> = T & { visible: boolean };

function visibleIf<PROPS>(component: React.ComponentType<PROPS>): React.FC<Props<PROPS>> {
    return (props: Props<PROPS>) => {
        const { visible, ...rest } = props;
        if (!visible) {
            return null;
        }

        return React.createElement(component, rest as any);
    };
}

export default visibleIf;
