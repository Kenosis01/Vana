import {
	type ModelInfo,
	type ProviderSettings,
	ANTHROPIC_DEFAULT_MAX_TOKENS,
	CLAUDE_CODE_DEFAULT_MAX_OUTPUT_TOKENS,
} from "@roo-code/types"

// ApiHandlerOptions

export type ApiHandlerOptions = Omit<ProviderSettings, "apiProvider">

// kilocode_change start
// Fireworks
// https://fireworks.ai/models
// TODO: Add support for all Fireworks models, currently only supports DeepSeek's serverless models

export const fireworksModels = {
	"accounts/fireworks/models/deepseek-r1": {
		maxTokens: 16384,
		contextWindow: 160000,
		supportsImages: false,
		supportsPromptCache: true,
		inputPrice: 3.0,
		outputPrice: 8.0,
	},

	"accounts/fireworks/models/deepseek-v3": {
		maxTokens: 16384,
		contextWindow: 128_000,
		supportsImages: false,
		supportsPromptCache: true,
		inputPrice: 0.9,
		outputPrice: 0.9,
	},

	"accounts/fireworks/models/llama4-scout-instruct-basic": {
		maxTokens: 16_384,
		contextWindow: 128_000,
		supportsImages: true,
		supportsPromptCache: true,
		inputPrice: 0.15,
		outputPrice: 0.6,
	},

	"accounts/fireworks/models/llama4-maverick-instruct-basic": {
		maxTokens: 16_384,
		contextWindow: 1_000_000,
		supportsImages: true,
		supportsPromptCache: true,
		inputPrice: 0.22,
		outputPrice: 0.88,
	},
} as const satisfies Record<string, ModelInfo>

export type FireworksModelId = keyof typeof fireworksModels
export const fireworksDefaultModelId: FireworksModelId = "accounts/fireworks/models/llama4-maverick-instruct-basic"
// kilocode_change end

// kilocode_change start
// Cerebras
// https://inference-docs.cerebras.ai/api-reference/models
export const cerebrasModels = {
	"llama-4-scout-17b-16e-instruct": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		description: "Fast inference model with ~2700 tokens/s",
	},
	"llama3.1-8b": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		description: "Efficient model with ~2100 tokens/s",
	},
	"llama-3.3-70b": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		description: "Powerful model with ~2600 tokens/s",
	},
	"qwen-3-32b": {
		maxTokens: 16382,
		contextWindow: 16382,
		supportsImages: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		description: "SOTA coding performance with ~2500 tokens/s",
	},
	"deepseek-r1-distill-llama-70b": {
		maxTokens: 8192,
		contextWindow: 8192,
		supportsImages: false,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
		description: "Advanced reasoning model with ~2300 tokens/s (private preview)",
	},
} as const satisfies Record<string, ModelInfo>
export type CerebrasModelId = keyof typeof cerebrasModels
export const cerebrasDefaultModelId: CerebrasModelId = "llama3.1-8b"

// kilocode_change end

// RouterName

const routerNames = [
	"openrouter",
	"requesty",
	"glama",
	"unbound",
	"litellm",
	"kilocode-openrouter",
	"ollama",
	"lmstudio",
] as const

export type RouterName = (typeof routerNames)[number]

export const isRouterName = (value: string): value is RouterName => routerNames.includes(value as RouterName)

export function toRouterName(value?: string): RouterName {
	if (value && isRouterName(value)) {
		return value
	}

	throw new Error(`Invalid router name: ${value}`)
}

// RouterModels

export type ModelRecord = Record<string, ModelInfo>

export type RouterModels = Record<RouterName, ModelRecord>

// Reasoning

export const shouldUseReasoningBudget = ({
	model,
	settings,
}: {
	model: ModelInfo
	settings?: ProviderSettings
}): boolean => !!model.requiredReasoningBudget || (!!model.supportsReasoningBudget && !!settings?.enableReasoningEffort)

export const shouldUseReasoningEffort = ({
	model,
	settings,
}: {
	model: ModelInfo
	settings?: ProviderSettings
}): boolean => (!!model.supportsReasoningEffort && !!settings?.reasoningEffort) || !!model.reasoningEffort

export const DEFAULT_HYBRID_REASONING_MODEL_MAX_TOKENS = 16_384
export const DEFAULT_HYBRID_REASONING_MODEL_THINKING_TOKENS = 8_192

// Max Tokens

export const getModelMaxOutputTokens = ({
	modelId,
	model,
	settings,
	format,
}: {
	modelId: string
	model: ModelInfo
	settings?: ProviderSettings
	format?: "anthropic" | "openai" | "gemini" | "openrouter"
}): number | undefined => {
	// Check for Claude Code specific max output tokens setting
	if (settings?.apiProvider === "claude-code") {
		return settings.claudeCodeMaxOutputTokens || CLAUDE_CODE_DEFAULT_MAX_OUTPUT_TOKENS
	}

	if (shouldUseReasoningBudget({ model, settings })) {
		return settings?.modelMaxTokens || DEFAULT_HYBRID_REASONING_MODEL_MAX_TOKENS
	}

	const isAnthropicContext =
		modelId.includes("claude") ||
		format === "anthropic" ||
		(format === "openrouter" && modelId.startsWith("anthropic/"))

	// For "Hybrid" reasoning models, discard the model's actual maxTokens for Anthropic contexts
	if (model.supportsReasoningBudget && isAnthropicContext) {
		return ANTHROPIC_DEFAULT_MAX_TOKENS
	}

	// For Anthropic contexts, always ensure a maxTokens value is set
	if (isAnthropicContext && (!model.maxTokens || model.maxTokens === 0)) {
		return ANTHROPIC_DEFAULT_MAX_TOKENS
	}

	// If model has explicit maxTokens and it's not the full context window, use it
	if (model.maxTokens && model.maxTokens !== model.contextWindow) {
		return model.maxTokens
	}

	// For non-Anthropic formats without explicit maxTokens, return undefined
	if (format) {
		return undefined
	}

	// Default fallback
	return ANTHROPIC_DEFAULT_MAX_TOKENS
}

// GetModelsOptions

export type GetModelsOptions =
	| { provider: "openrouter"; apiKey?: string; baseUrl?: string } // kilocode_change: add apiKey, baseUrl
	| { provider: "glama" }
	| { provider: "requesty"; apiKey?: string }
	| { provider: "unbound"; apiKey?: string }
	| { provider: "litellm"; apiKey: string; baseUrl: string }
	| { provider: "kilocode-openrouter"; kilocodeToken?: string } // kilocode_change
	| { provider: "cerebras"; cerebrasApiKey?: string } // kilocode_change
	| { provider: "ollama"; baseUrl?: string }
	| { provider: "lmstudio"; baseUrl?: string }
