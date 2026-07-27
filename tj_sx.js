let currentSystemConfig = {
    "knownDataGroups": [
        [
            1,
            2,
            4,
            6,
            8,
            9
        ],
        [
            12,
            13,
            14,
            18
        ],
        [
            23,
            24,
            26,
            28
        ],
        [
            32,
            33,
            37,
            38
        ],
        [
            40,
            41,
            42,
            45,
            49
        ],
        [
            53,
            54,
            58
        ],
        [
            61,
            64,
            67,
            68
        ],
        [
            74,
            75,
            76,
            78
        ],
        []
    ],
    "configOptions": {
        "mod3": {
            "title": "012路比例配置",
            "subNames": [
                "0路",
                "1路",
                "2路"
            ],
            "options": [
                {
                    "pattern": [
                        3,
                        4
                    ],
                    "threshold": 1.32
                },
                {
                    "pattern": [
                        3,
                        4
                    ],
                    "threshold": 1.0
                },
                {
                    "pattern": [
                        3,
                        4,
                        5
                    ],
                    "threshold": 1.3
                }
            ]
        },
        "oe": {
            "title": "奇偶比例配置",
            "subNames": [
                "奇数",
                "偶数"
            ],
            "options": [
                {
                    "pattern": [
                        5,
                        6
                    ],
                    "threshold": 1.1
                },
                {
                    "pattern": [
                        4,
                        5
                    ],
                    "threshold": 1.16
                }
            ]
        },
        "range": {
            "title": "三区比例配置",
            "subNames": [
                "一区",
                "二区",
                "三区"
            ],
            "options": [
                {
                    "pattern": [
                        4,
                        5
                    ],
                    "threshold": 1.0
                },
                {
                    "pattern": [
                        3,
                        4,
                        5
                    ],
                    "threshold": 1.4
                },
                {
                    "pattern": [
                        2
                    ],
                    "threshold": 0.48
                }
            ]
        },
        "prime": {
            "title": "质合比例配置",
            "subNames": [
                "质数",
                "合数"
            ],
            "options": [
                {
                    "pattern": [
                        4,
                        5
                    ],
                    "threshold": 1.6
                },
                {
                    "pattern": [
                        5,
                        6,
                        7,
                        8
                    ],
                    "threshold": 1.8
                }
            ]
        },
        "quad": {
            "title": "象限比例配置",
            "subNames": [
                "一象限",
                "二象限",
                "三象限",
                "四象限"
            ],
            "options": [
                {
                    "pattern": [
                        2,
                        3,
                        4
                    ],
                    "threshold": 0.92
                },
                {
                    "pattern": [
                        2,
                        3
                    ],
                    "threshold": 0.68
                },
                {
                    "pattern": [
                        2,
                        3
                    ],
                    "threshold": 0.8
                },
                {
                    "pattern": [
                        1,
                        2
                    ],
                    "threshold": 0.96
                }
            ]
        }
    }
};
