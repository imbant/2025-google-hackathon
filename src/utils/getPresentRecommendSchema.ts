import { Type } from "@google/genai"

export const getPresentRecommendSchema = () => {
    return {
        type: Type.ARRAY,
        description: "推荐的礼物列表",
        items: {
            type: Type.OBJECT,
            description: "单个推荐的礼物",
            properties: {
                presentName: {
                    type: Type.STRING,
                    description: "推荐的礼物名称",
                },
                presentReason: {
                    type: Type.STRING,
                    description: "推荐的理由",
                },
                presentSuggestion: {
                    type: Type.STRING,
                    description: "送礼的建议",
                },
                presentSummary: {
                    type: Type.STRING,
                    description: "基于presentReason和presentSuggestion的简短总结",
                },
                tags: {
                    type: Type.ARRAY,
                    description: "这个礼物有哪些常见或通用的特征，以简短的标签形式列出，注意，每个礼物之间的标签可以相同，也可以不同，你要基于用户的选择，推测他可能想要什么标签的礼物，然后给出符合这些标签的礼物",
                    maxItems: "8",
                    items: {
                        type: Type.STRING,
                        description: "单个标签的简单又有特征的名字",
                    },
                },
                maxPrice: {
                    type: Type.NUMBER,
                    description: "推荐的礼物的价格范围中的最大值，注意，要符合用户选择的预算",
                    maximum: 20000,
                },
                minPrice: {
                    type: Type.NUMBER,
                    description: "推荐的礼物的价格范围中的最小值，注意，要符合用户选择的预算",
                    minimum: 0,
                },
            },
        },
    }
}