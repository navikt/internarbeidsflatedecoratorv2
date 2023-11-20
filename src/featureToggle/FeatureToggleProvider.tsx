import React, { createContext, useContext, useEffect, useState } from 'react';
import { FeatureTogglesResponse, hentFeatureToggles } from '../redux/api';
import { FeatureToggles } from './FeatureToggles';

const useFeatureToggles = (): FeatureTogglesResponse => {
    const [toggles, setToggles] = useState<FeatureTogglesResponse>(defaultToggles());

    useEffect(() => {
        hentFeatureToggles().then((res) => {
            if (res.data) {
                setToggles(res.data);
            }
        });
    }, []);

    return toggles;
};

const defaultToggles = (): FeatureTogglesResponse => {
    return {
        'modiacontextholder.ny-arbeidssoker-registrering-url': false
    };
};

const featureToggleContext = createContext(defaultToggles());

const FeatureToggleProvider: React.FC = ({ children }) => {
    const toggles = useFeatureToggles();

    return (
        <featureToggleContext.Provider value={toggles}>{children}</featureToggleContext.Provider>
    );
};

export default FeatureToggleProvider;

export const useFeatureToggle = (id: FeatureToggles) => {
    const toggles = useContext(featureToggleContext);

    return toggles[id];
};
