# tencent-wx-app
微信小程序 DefinitelyTyped.

# Install

```
npm i tencent-wx-app --save-dev
```

# How to Use

## add this module in your tsconfig.json

```json
{
	"compilerOptions": {
		"types": [
			"tencent-wx-app"
		]
	}
}
```

## use wx freely

```ts
getCurrentPages().forEach((page)=>{
	page.setData([]);
});
```
