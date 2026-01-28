# Production build (uses npm package from registry)
build-astro:
	npm install && npm run build && touch dist/.nojekyll

# Switch to development mode (uses local @jet-w/astro-blog)
use-dev:
	cp package.json package.prod.json
	cp package.dev.json package.json
	rm -rf node_modules package-lock.json
	npm install

# Switch to production mode (uses npm registry)
use-prod:
	@if [ -f package.prod.json ]; then \
		cp package.prod.json package.json; \
		rm package.prod.json; \
		rm -rf node_modules package-lock.json; \
		npm install; \
	else \
		echo "Already in production mode"; \
	fi

# Development build (for local testing)
build-dev:
	npm run build && touch dist/.nojekyll

# Start dev server
dev:
	npm run dev