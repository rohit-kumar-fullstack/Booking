import React from 'react';

if (__DEV__) {
    const whyDidYouRender = require('@welldone-software/why-did-you-render');

    whyDidYouRender(React, {
        trackAllPureComponents: true,
        trackHooks: true,
        collapseGroups: false, // <-- disable groups to avoid Hermes swallowing logs
        logOnDifferentValues: true,
    });

    // Override console.groupCollapsed to fallback to console.log if Hermes
    const originalGroupCollapsed = console.groupCollapsed;
    console.groupCollapsed = (...args) => {
        try {
            originalGroupCollapsed(...args);
        } catch (e) {
            console.log(...args);
        }
    };
}