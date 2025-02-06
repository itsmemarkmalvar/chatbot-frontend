export const ispConfig = {
    PLDT: {
        name: 'PLDT',
        aiName: 'PLDT AINA',
        aiFullName: 'Advanced Intelligent Network Assistant',
        color: '#0033A0'
    },
    Globe: {
        name: 'Globe',
        aiName: 'GlobeGuide',
        aiFullName: 'Your Digital Globe Assistant',
        color: '#0064DE'
    },
    Converge: {
        name: 'Converge',
        aiName: 'C-Verse',
        aiFullName: 'Your Virtual Converge Assistant',
        color: '#EE1C25'
    }
};

export const getIspAiName = (ispName) => {
    return ispConfig[ispName]?.aiName || 'ISP Support Assistant';
};

export const getIspAiFullName = (ispName) => {
    return ispConfig[ispName]?.aiFullName || '';
}; 