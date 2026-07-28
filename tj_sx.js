let currentSystemConfig = {
    "knownDataGroups": [
        [
            1,
            3,
            4,
            7,
            9
        ],
        [
            10,
            13,
            16
        ],
        [
            21,
            23,
            26,
            28,
            29
        ],
        [
            31,
            33,
            36,
            38
        ],
        [
            41,
            42,
            44,
            45,
            47,
            49
        ],
        [
            50,
            52,
            55,
            58
        ],
        [
            60,
            63,
            67,
            68,
            69
        ],
        [
            73,
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
                        4,
                        5
                    ],
                    "threshold": 1.7
                },
                {
                    "pattern": [
                        3,
                        4
                    ],
                    "threshold": 1.2
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
                        4,
                        5,
                        6
                    ],
                    "threshold": 1.32
                },
                {
                    "pattern": [
                        4,
                        5,
                        6
                    ],
                    "threshold": 1.12
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
                    "threshold": 0.92
                },
                {
                    "pattern": [
                        3,
                        4,
                        5
                    ],
                    "threshold": 1.28
                },
                {
                    "pattern": [
                        2
                    ],
                    "threshold": 0.42
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
                        3,
                        4,
                        5
                    ],
                    "threshold": 1.8
                },
                {
                    "pattern": [
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
                        3
                    ],
                    "threshold": 0.84
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
                        2,
                        3
                    ],
                    "threshold": 1.08
                },
                {
                    "pattern": [
                        1,
                        2,
                        3
                    ],
                    "threshold": 1.12
                }
            ]
        }
    }
};
