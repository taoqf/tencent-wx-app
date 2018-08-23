# tencent-wx-app

微信小程序 DefinitelyTyped.

请移步 [@types/weixin-app](https://www.npmjs.com/package/@types/weixin-app)

## Install

```sh
npm i tencent-wx-app --save-dev
```

## How to Use

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
