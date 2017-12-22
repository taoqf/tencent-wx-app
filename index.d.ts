declare namespace wx {
	interface DataResponse {
		/** 回调函数返回的内容 */
		data: any;
	}
	interface ErrMsgResponse {
		/** 成功：ok，错误：详细信息 */
		errMsg: 'ok' | string;
	}

	interface ShareMessage extends BaseOptions {
		title?: string;	// 转发标题	当前小程序名称
		path?: string;	// 转发路径	当前页面 path ，必须是以 / 开头的完整路径
		imageUrl?: string;	// 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。iOS 显示图片长宽比是 5:4，Android 显示图片长宽比是 215:168。高度超出部分会从底部裁剪。推荐使用 Android 图片长宽比，可保证图片在两个平台都完整显示，其中 iOS 底部会出现一小段白色		1.5.0
		success?(res: {
			shareTickets: string[];
		}): void;
	}

	interface PageOptions {
		/** 页面的初始数据 */
		data?: any;
		/** 生命周期函数--监听页面加载 */
		onLoad?(this: Page, options: any): void;
		/** 生命周期函数--监听页面渲染完成 */
		onReady?(this: Page): void;
		/** 生命周期函数--监听页面显示 */
		onShow?(this: Page): void;
		/** 生命周期函数--监听页面隐藏 */
		onHide?(this: Page): void;
		/** 生命周期函数--监听页面卸载 */
		onUnload?(this: Page): void;
		getPhoneNumber?(e: {
			detail: {
				errMsg: string;
				iv: string;
				encryptedData: string;
			}
		}): void;
		onShareAppMessage?(options: {
			from: 'button' | 'menu';	// 转发事件来源。button：页面内转发按钮；menu：右上角转发菜单
			target?: any;	// 如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
		}): ShareMessage;
		[key: string]: any;
	}

	interface AppOptions {
		/**
		 * 生命周期函数--监听小程序初始化
		 * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
		 */
		onLaunch?(this: App): void;
		/**
		 * 生命周期函数--监听小程序显示
		 * 当小程序启动，或从后台进入前台显示，会触发 onShow
		 */
		onShow?(this: App): void;
		/**
		 * 生命周期函数--监听小程序隐藏
		 * 当小程序从前台进入后台，会触发 onHide
		 */
		onHide?(this: App): void;
		[key: string]: any;
	}

	interface BaseOptions {
		/** 接口调用成功的回调函数 */
		success?(res: any): void;
		/** 接口调用失败的回调函数 */
		fail?(res: any): void;
		/** 接口调用结束的回调函数（调用成功、失败都会执行） */
		complete?(res: any): void;
	}
}

// 发起请求
declare namespace wx {
	interface RequestHeader {
		[key: string]: string;
	}
	interface RequestOptions extends BaseOptions {
		/** 开发者服务器接口地址 */
		url: string;
		/** 请求的参数 */
		data?: string | any;
		/** 设置请求的 header , header 中不能设置 Referer */
		header?: RequestHeader;
		/** 默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT */
		method?: string;
		dataType?: 'json';	// 如果设为json，会尝试对返回的数据做一次 JSON.parse
		/** 收到开发者服务成功返回的回调函数，res = {data: '开发者服务器返回的内容'} */
		success?(res: DataResponse): void;
	}
	/**
	 * wx.request发起的是https请求。一个微信小程序，同时只能有5个网络请求连接。
	 */
	function request(options: RequestOptions): void;
}

// 上传下载
declare namespace wx {
	interface UploadFileResponse {
		data: string;		// 开发者服务器返回的数据
		statusCode: number;	// 开发者服务器返回的 HTTP 状态码
	}
	interface UploadFileOptions extends BaseOptions {
		/** 开发者服务器 url */
		url: string;
		/** 要上传文件资源的路径 */
		filePath: string;
		/** 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容 */
		name: string;
		/** HTTP 请求 Header , header 中不能设置 Referer */
		header?: RequestHeader;
		/** HTTP 请求中其他额外的 form data */
		formData?: any;
		success?(res: UploadFileResponse): void;
	}

	interface UploadProgressUpdate {
		progress: number;	// 上传进度百分比
		totalBytesSent: number;	// 已经上传的数据长度，单位 Bytes
		totalBytesExpectedToSend: number;	// 预期需要上传的数据总长度，单位 Bytes
	}

	interface UploadTask {
		onProgressUpdate(update: UploadProgressUpdate): void;	// 监听上传进度变化	1.4.0
		abort(): void;	//		中断上传任务	1.4.0
	}
	/**
	 * 将本地资源上传到开发者服务器。
	 * 如页面通过 wx.chooseImage 等接口获取到一个本地资源的临时文件路径后，
	 * 可通过此接口将本地资源上传到指定服务器。
	 * 客户端发起一个 HTTPS POST 请求，
	 * 其中 Content-Type 为 multipart/form-data 。
	 */
	function uploadFile(options: UploadFileOptions): UploadTask;

	interface DownloadFileResponse {
		tempFilePath: string;	// 临时文件路径，下载后的文件会存储到一个临时文件
		statusCode: number;		// 开发者服务器返回的 HTTP 状态码
	}

	interface DownloadFileOptions extends BaseOptions {
		/** 下载资源的 url */
		url: string;
		/** HTTP 请求 Header，header 中不能设置 Referer */
		header?: RequestHeader;
		/** 下载成功后以 tempFilePath 的形式传给页面，res = {tempFilePath: '文件的临时路径'} */
		success?(res: DownloadFileResponse): void;
	}
	/**
	 * 下载文件资源到本地。客户端直接发起一个 HTTP GET 请求，
	 * 把下载到的资源根据 type 进行处理，并返回文件的本地临时路径。
	 */
	function downloadFile(options: DownloadFileOptions): void;
}

// WebSocket
declare namespace wx {
	interface ConnectSocketOptions extends BaseOptions {
		/** 开发者服务器接口地址，必须是 HTTPS 协议，且域名必须是后台配置的合法域名 */
		url: string;
		/** 请求的数据 */
		data?: any;
		/** HTTP Header , header 中不能设置 Referer */
		header?: RequestHeader;
		/** 默认是GET */
		method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
		protocols?: string[];	// 子协议数组
	}
	/**
	 * 创建一个 WebSocket 连接；
	 * 一个微信小程序同时只能有一个 WebSocket 连接，
	 * 如果当前已存在一个 WebSocket 连接，
	 * 会自动关闭该连接，并重新创建一个 WebSocket 连接。
	 */
	function connectSocket(options: ConnectSocketOptions): void;

	/** 监听WebSocket连接打开事件。 */
	function onSocketOpen(callback: () => void): void;

	/** 监听WebSocket错误。 */
	function onSocketError(callback: (error: any) => void): void;

	interface SendSocketMessageOptions extends BaseOptions {
		/** 需要发送的内容 */
		data: string | ArrayBuffer;
	}
	/**
	 * 通过 WebSocket 连接发送数据，需要先 wx.connectSocket，
	 * 并在 wx.onSocketOpen 回调之后才能发送。
	 */
	function sendSocketMessage(options: SendSocketMessageOptions): void;

	/**
	 * 监听WebSocket接受到服务器的消息事件。
	 */
	function onSocketMessage(callback: (res: DataResponse) => void): void;

	interface CloseSocketOptions extends BaseOptions {
		code?: number;	// 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）	1.4.0
		reason?: string;	// 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本（不是字符）
	}

	/**
	 * 关闭WebSocket连接。
	 */
	function closeSocket(options: CloseSocketOptions): void;

	/** 监听WebSocket关闭。 */
	function onSocketClose(callback: () => void): void;
}

// 媒体-----图片
declare namespace wx {
	type ImageSizeType = 'original' | 'compressed';
	type ImageSourceType = 'album' | 'camera';
	type VideoSourceType = 'album' | 'camera';
	type CameraDevice = 'front' | 'back';

	interface TempFilesData {
		/** 文件的临时路径 */
		tempFilePaths: string;
		tempFiles: File[];	// 图片的本地文件列表，每一项是一个 File 对象	1.2.0
	}
	interface ChooseImageOptions extends BaseOptions {
		/** 最多可以选择的图片张数，默认9 */
		count?: number;
		/** original 原图，compressed 压缩图，默认二者都有 */
		sizeType?: ImageSizeType[];
		/** album 从相册选图，camera 使用相机，默认二者都有 */
		sourceType?: ImageSourceType[];
		/** 成功则返回图片的本地文件路径列表 tempFilePaths */
		success(res: TempFilesData): void;
	}
	/**
	 * 从本地相册选择图片或使用相机拍照。
	 */
	function chooseImage(options: ChooseImageOptions): void;

	interface PreviewImageOptions extends BaseOptions {
		/** 当前显示图片的链接，不填则默认为 urls 的第一张 */
		current?: string;
		/** 需要预览的图片链接列表 */
		urls: string[];
	}
	/**
	 * 预览图片。
	 */
	function previewImage(options: PreviewImageOptions): void;

	interface GetImageInfoOptions extends BaseOptions {
		/**
		 * 图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径
		 */
		src: string;
		success?(ret: {
			width: number;	// 图片宽度，单位px
			height: number;	// 图片高度，单位px
			path: string;	// 返回图片的本地路径
		}): void;
	}

	/**
	 * 获取图片信息
	 */
	function getImageInfo(options: GetImageInfoOptions): void;

	interface SaveImageToPhotosAlbumOption extends BaseOptions {
		filePath: string;	// 图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径
		success?(errMsg: string): void;	// 接口调用成功的回调函数
	}

	/** 保存图片到系统相册。需要用户授权 scope.writePhotosAlbum */
	function saveImageToPhotosAlbum(options?: SaveImageToPhotosAlbumOption): void;
}

// 媒体-----录音管理
declare namespace wx {
	interface RecordManager {
		start(options: {
			duration?: number;	// 指定录音的时长，单位 ms ，如果传入了合法的 duration ，在到达指定的 duration 后会自动停止录音，最大值 600000（10 分钟）,默认值 60000（1 分钟）
			sampleRate?: 8000 | 11025 | 12000 | 16000 | 22050 | 24000 | 32000 | 44100 | 48000;	// 采样率，有效值 8000/16000/44100
			numberOfChannels?: number;	// 录音通道数，有效值 1/2
			encodeBitRate?: number;	// 编码码率，有效值见下表格
			format?: 'aac' | 'mp3';	//	音频格式，有效值 aac/mp3
			frameSize?: number;	// 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3 格式。
		}): void;	// 开始录音
		pause(): void;	// 暂停录音
		resume(): void;	// 继续录音
		stop(): void;	// 停止录音
		onStart(callback: () => void): void;	// 录音开始事件
		onPause(callback: () => void): void;	// 录音暂停事件
		onStop(callback: (data: {
			tempFilePath: string;	// 录音文件的临时路径
		}) => void): void;	// 录音停止事件，会回调文件地址
		onFrameRecorded(callback: (data: {
			frameBuffer: ArrayBuffer;	// 录音分片结果数据
			isLastFrame: boolean;	// 当前帧是否正常录音结束前的最后一帧
		}) => void): void;	// 已录制完指定帧大小的文件，会回调录音分片结果数据。如果设置了 frameSize ，则会回调此事件
		onError(callback: (errMsg: string) => void): void;	// 录音错误事件, 会回调错误信息
	}

	/** 获取全局唯一的录音管理器 recorderManager。 */
	function getRecorderManager(): RecordManager;
}

// 媒体-----背景音乐播放管理
declare namespace wx {
	interface BackgroundAudioManager {
		readonly duration: number;	// 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
		readonly currentTime: number;	// 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回
		readonly paused: boolean;	// 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
		src: string;	// 音频的数据源，默认为空字符串，当设置了新的 src 时，会自动开始播放 ，目前支持的格式有 m4a, aac, mp3, wav
		startTime: number;	// 音频开始播放的位置（单位：s）
		readonly buffered: number;	// 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲。
		title: string;	// 音频标题，用于做原生音频播放器音频标题。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值。
		epname: string;	// 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
		singer: string;	// 歌手名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
		coverImgUrl: string;	// 封面图url，用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图。
		webUrl: string;	// 页面链接，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
	}
	/**
	 * @see [errcode 说明](https://mp.weixin.qq.com/debug/wxadoc/dev/api/getBackgroundAudioManager.html)
	 */
	interface BackgroundAudioManager {
		play(): void;	// 播放
		pause(): void;	// 暂停
		stop(): void;	// 停止
		seek(position: number): void;	// 跳转到指定位置，单位 s
		onCanplay(callback: (errCode: number) => void): void;	// 背景音频进入可以播放状态，但不保证后面可以流畅播放
		onPlay(callback: (errCode: number) => void): void;	// 背景音频播放事件
		onPause(callback: (errCode: number) => void): void;	// 背景音频暂停事件
		onStop(callback: (errCode: number) => void): void;	// 背景音频停止事件
		onEnded(callback: (errCode: number) => void): void;	// 背景音频自然播放结束事件
		onTimeUpdate(callback: (errCode: number) => void): void;	// 背景音频播放进度更新事件
		onPrev(callback: (errCode: number) => void): void;	// 用户在系统音乐播放面板点击上一曲事件（iOS only）
		onNext(callback: (errCode: number) => void): void;	// 用户在系统音乐播放面板点击下一曲事件（iOS only）
		onError(callback: (errCode: number) => void): void;	// 背景音频播放错误事件
		onWaiting(callback: (errCode: number) => void): void;	// 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
	}
	/** 获取全局唯一的背景音频管理器 backgroundAudioManager。 */
	function getBackgroundAudioManager(): BackgroundAudioManager;
}

// 媒体-----音频组件控制
declare namespace wx {
	interface InnerAudioContext {
		src: string;	// 音频的数据链接，用于直接播放。
		startTime: number;	// 开始播放的位置（单位：s），默认 0
		autoplay: boolean;	// 是否自动开始播放，默认 false
		loop: boolean;	//	是否循环播放，默认 false
		obeyMuteSwitch: boolean;	//	是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音，默认值 true
		readonly duration: number;	// 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
		readonly currentTime: number;	// 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回，时间不取整，保留小数点后 6 位
		readonly paused: boolean;	// 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
		readonly buffered: number;	// 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲。
	}

	/**
	 * @see [errCode 说明](https://mp.weixin.qq.com/debug/wxadoc/dev/api/createInnerAudioContext.html)
	 */
	interface InnerAudioContext {
		play(): void;	// 播放
		pause(): void;	// 暂停
		stop(): void;	// 停止
		seek(position: number): void;	// 跳转到指定位置，单位 s
		destroy(): void;	// 销毁当前实例
		onCanplay(callback: (errCode: number) => void): void;	// 音频进入可以播放状态，但不保证后面可以流畅播放
		onPlay(callback: (errCode: number) => void): void;	// 音频播放事件
		onPause(callback: (errCode: number) => void): void;	// 音频暂停事件
		onStop(callback: (errCode: number) => void): void;	// 音频停止事件
		onEnded(callback: (errCode: number) => void): void;	// 音频自然播放结束事件
		onTimeUpdate(callback: (errCode: number) => void): void;	// 音频播放进度更新事件
		onError(callback: (errCode: number) => void): void;	// 音频播放错误事件
		onWaiting(callback: (errCode: number) => void): void;	// 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
		onSeeking(callback: (errCode: number) => void): void;	// 音频进行 seek 操作事件
		onSeeked(callback: (errCode: number) => void): void;	// 音频完成 seek 操作事件
	}
	function createInnerAudioContext(): InnerAudioContext;
}

// 媒体-----视频
declare namespace wx {
	interface VideoData {
		/** 选定视频的临时文件路径 */
		tempFilePath: string;
		/** 选定视频的时间长度 */
		duration: number;
		/** 选定视频的数据量大小 */
		size: number;
		/** 返回选定视频的长 */
		height: number;
		/** 返回选定视频的宽 */
		width: number;
	}
	interface ChooseVideoOptions extends BaseOptions {
		/** album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera'] */
		sourceType?: VideoSourceType[];
		/** 是否压缩所选的视频源文件，默认值为true，需要压缩 */
		compressed?: boolean;
		/** 拍摄视频最长拍摄时间，单位秒。最长支持60秒 */
		maxDuration?: number;
		/** 前置或者后置摄像头，默认为前后都有，即：['front', 'back'] */
		camera?: CameraDevice;
		/** 接口调用成功，返回视频文件的临时文件路径，详见返回参数说明 */
		success?(res: VideoData): void;
	}
	/**
	 * 拍摄视频或从手机相册中选视频，返回视频的临时文件路径。
	 */
	function chooseVideo(options: ChooseVideoOptions): void;

	interface SaveVideoOptions extends BaseOptions {
		filePath: string;	// 视频文件路径，可以是临时文件路径也可以是永久文件路径
		success(errMsg: string): void;
	}

	/** 保存视频到系统相册。需要用户授权 scope.writePhotosAlbum */
	function saveVideoToPhotosAlbum(options: SaveVideoOptions): void;
}

// 媒体-----视频组件控制
declare namespace wx {
	interface VideoContext {
		/**
		 * 播放
		 */
		play(): void;
		/**
		 * 暂停
		 */
		pause(): void;
		/**
		 * 跳转到指定位置，单位 s
		 */
		seek(position: number): void;
		/**
		 * 发送弹幕，danmu 包含两个属性 text, color。
		 */
		sendDanmu(danmu: {
			text: string;
			color: number | string;
		}): void;

		playbackRate(rate: 0.5 | 0.8 | 1.0 | 1.25 | 1.5): void;	// 设置倍速播放，支持的倍率有 0.5/0.8/1.0/1.25/1.5
		requestFullScreen(options?: {
			direction: 0 | 90 | -90;	// 设置全屏时视频的方向，不指定则根据宽高比自动判断。有效值为 0（正常竖向）, 90（屏幕逆时针90度）, -90（屏幕顺时针90度）
		}): void;	// 进入全屏
		exitFullScreen(): void;	// 退出全屏
	}

	/**
	 * 创建并返回 video 上下文 videoContext 对象.在自定义组件下，第二个参数传入组件实例this，以操作组件内 <video/> 组件
	 * @param videoId video标签id <video  src="{{src}}" id="myVideo" ></video>
	 */
	function createVideoContext(videoId: string, _this?: any): VideoContext;
}

// 媒体-----相机组件控制
declare namespace wx {
	interface TakePhotoOptions extends BaseOptions {
		quality?: 'high' | 'normal' | 'low';	// 成像质量，值为high, normal, low，默认normal
		success?(res: { tempImagePath: string; }): void;
	}

	interface StartRecordOptions extends BaseOptions {
		timeoutCallback?(res: { tempThumbPath: string; tempVideoPath: string; }): void;	// 超过30s或页面onHide时会结束录像，res = { tempThumbPath, tempVideoPath }
	}

	interface StopRecordOptions extends BaseOptions {
		success?(res: { tempThumbPath: string; tempVideoPath: string; }): void;
	}
	interface CameraContext {
		takePhoto(options: TakePhotoOptions): void;	// 拍照，可指定质量，成功则返回图片
		startRecord(options: StartRecordOptions): void;	// 开始录像
		stopRecord(options: StopRecordOptions): void;	// 结束录像，成功则返回封面与视频
	}
	/**
	 * 创建并返回 camera 上下文 cameraContext 对象，cameraContext 与页面的 camera 组件绑定，一个页面只能有一个camera，通过它可以操作对应的 <camera/> 组件。 在自定义组件下，第一个参数传入组件实例this，以操作组件内 <camera/> 组件
	 */
	function createCameraContext(_this?: any): CameraContext;
}

// 文件
declare namespace wx {
	interface SavedFileData {
		/** 文件的保存路径 */
		savedFilePath: string;
	}
	interface SaveFileOptions extends BaseOptions {
		/** 需要保存的文件的临时路径 */
		tempFilePath: string;
		/** 返回文件的保存路径，res = {savedFilePath: '文件的保存路径'} */
		success?(res: SavedFileData): void;
	}
	/**
	 * 保存文件到本地。
	 * 本地文件存储的大小限制为 10M
	 */
	function saveFile(options: SaveFileOptions): void;

	interface File {
		/**
		 * 文件的本地路径
		 */
		filePath: string;
		/**
		 * 文件的保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
		 */
		createTime: number;
		/**
		 * 文件大小，单位B
		 */
		size: number;
	}
	interface GetSavedFileListData {
		/**
		 * 接口调用结果
		 */
		errMsg: string;
		/**
		 * 文件列表
		 */
		fileList: File[];
	}

	interface GetSavedFileListOptions extends BaseOptions {
		/** 接口调用成功的回调函数 */
		success?(res: GetSavedFileListData): void;
	}
	/**
	 * 获取本地已保存的文件列表
	 */
	function getSavedFileList(options: GetSavedFileListOptions): void;

	interface SavedFileInfoData {
		/**
		 * 接口调用结果
		 */
		errMsg: string;
		/**
		 * 文件大小，单位B
		 */
		size: number;
		/**
		 * 文件的保存是的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
		 */
		createTime: number;
	}
	interface GetSavedFileInfoOptions extends BaseOptions {
		filePath: string;
		/** 接口调用成功的回调函数 */
		success?(res: SavedFileInfoData): void;
	}
	/**
	 * 获取本地文件的文件信息
	 */
	function getSavedFileInfo(options: GetSavedFileInfoOptions): void;

	interface RemoveSavedFileOptions extends BaseOptions {
		filePath: string;	// 需要删除的文件路径
	}
	/**
	 * 删除本地存储的文件
	 */
	function removeSavedFile(options: RemoveSavedFileOptions): void;
	interface OpenDocumentOptions extends BaseOptions {
		/**
		 * 文件路径，可通过 downFile 获得
		 */
		filePath: string;
		fileType?: 'doc' | 'xls' | 'ppt' | 'pdf' | 'docx' | 'xlsx' | 'pptx';	// 文件类型，指定文件类型打开文件，有效值 doc, xls, ppt, pdf, docx, xlsx, pptx
	}
	/**
	 * 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
	 */
	function openDocument(options: OpenDocumentOptions): void;

	interface GetFileInfoOptions extends BaseOptions {
		filePath: string;	// 本地文件路径
		digestAlgorithm?: 'md5' | 'sha1';	// 计算文件摘要的算法，默认值 md5，有效值：md5，sha1
		success?(res: {
			size: number;	// 文件大小，单位：B
			digest: string;	// 按照传入的 digestAlgorithm 计算得出的的文件摘要
			errMsg: string;	// 调用结果
		}): void;	//接口调用成功的回调函数
	}

	function getFileInfo(options: GetFileInfoOptions): void;
}

// 数据缓存
declare namespace wx {
	interface SetStorageOptions extends BaseOptions {
		/** 本地缓存中的指定的 key */
		key: string;
		/** 需要存储的内容 */
		data: any | string;
	}
	/**
	 * 将数据存储在本地缓存中指定的 key 中，
	 * 会覆盖掉原来该 key 对应的内容，这是一个异步接口。
	 */
	function setStorage(options: SetStorageOptions): void;
	/**
	 * 将 data 存储在本地缓存中指定的 key 中，
	 * 会覆盖掉原来该 key 对应的内容，这是一个同步接口。
	 *
	 * @param {string} key 本地缓存中的指定的 key
	 * @param {(Object | string)} data 需要存储的内容
	 */
	function setStorageSync(key: string, data: any | string): void;

	interface GetStorageOptions extends BaseOptions {
		/** 本地缓存中的指定的 key */
		key: string;
		/** 接口调用的回调函数,res = {data: key对应的内容} */
		success(res: DataResponse): void;
	}
	/**
	 * 从本地缓存中异步获取指定 key 对应的内容。
	 */
	function getStorage(options: GetStorageOptions): void;

	/**
	 * 从本地缓存中同步获取指定 key 对应的内容。
	 *
	 * @param {string} key
	 * @returns {(Object | string)}
	 */
	function getStorageSync(key: string): any | string;

	interface StorageInfo {
		/**
		 * 当前storage中所有的key
		 */
		keys: string[];
		/**
		 * 当前占用的空间大小, 单位kb
		 */
		currentSize: number;
		/**
		 * 限制的空间大小，单位kb
		 */
		limitSize: number;
	}
	interface GetStorageInfoOptions extends BaseOptions {
		success(res: StorageInfo): void;
	}
	/**
	 * 异步获取当前storage的相关信息
	 */
	function getStorageInfo(options: GetStorageInfoOptions): void;
	function getStorageInfoSync(): GetStorageInfoOptions;
	interface RemoveStorageOptions extends BaseOptions {
		key: string;
		success?(res: DataResponse): void;
	}
	function removeStorage(options: RemoveStorageOptions): void;
	function removeStorageSync(key: string): DataResponse;

	/**
	 * 清理本地数据缓存。
	 */
	function clearStorage(): void;
	/**
	 * 同步清理本地数据缓存
	 */
	function clearStorageSync(): void;
}

// 位置-----获取位置
declare namespace wx {
	interface LocationData {
		/** 纬度，浮点数，范围为-90~90，负数表示南纬 */
		latitude: number;
		/** 经度，浮点数，范围为-180~180，负数表示西经 */
		longitude: number;
		/** 速度，浮点数，单位m/s */
		speed: number;
		/** 位置的精确度 */
		accuracy: number;
		altitude: number;	// 高度，单位 m
		verticalAccuracy: number;	// 垂直精度，单位 m（Android 无法获取，返回 0）
		horizontalAccuracy: number;	// 水平精度，单位 m
	}

	interface GetLocationOptions extends BaseOptions {
		/** 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标 */
		type?: 'wgs84' | 'gcj02';
		altitude?: boolean;	// 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
		/** 接口调用成功的回调函数，返回内容详见返回参数说明。 */
		success(res: LocationData): void;
	}
	/**
	 * 获取当前的地理位置、速度。
	 */
	function getLocation(options: GetLocationOptions): void;

	interface ChooseLocationData {
		/**
		 * 位置名称
		 */
		name: string;
		/**
		 * 详细地址
		 */
		address: string;
		/**
		 * 纬度，浮点数，范围为-90~90，负数表示南纬
		 */
		latitude: number;
		/**
		 * 经度，浮点数，范围为-180~180，负数表示西经
		 */
		longitude: number;
	}
	interface ChooseLocationOptions extends BaseOptions {
		success(res: ChooseLocationData): void;
	}
	/**
	 * 打开地图选择位置
	 */
	function chooseLocation(options: ChooseLocationOptions): void;
}

// 位置-----查看位置
declare namespace wx {
	interface OpenLocationOptions extends BaseOptions {
		/** 纬度，范围为-90~90，负数表示南纬 */
		latitude: number;
		/** 经度，范围为-180~180，负数表示西经 */
		longitude: number;
		/** 缩放比例，范围1~28，默认为28 */
		scale?: number;
		/** 位置名 */
		name?: string;
		/** 地址的详细说明 */
		address?: string;
	}
	/**
	 * 使用微信内置地图查看位置
	 */
	function openLocation(options: OpenLocationOptions): void;
}

// 位置-----地图组件控制
declare namespace wx {
	interface Position {
		longitude: number;
		latitude: number;
	}
	interface GetCenterLocationOptions extends BaseOptions {
		success(res: Position): void;
	}

	interface TranslateMarkerOptions extends BaseOptions {
		markerId: number;	// 指定marker
		destination: Position;	// 指定marker移动到的目标点
		autoRotate: boolean;	// 移动过程中是否自动旋转marker
		rotate: number;	// marker的旋转角度
		duration?: number;	// 动画持续时长，默认值1000ms，平移与旋转分别计算
		animationEnd?(): void;	// 动画结束回调函数
	}

	interface IncludePointsOptions extends BaseOptions {
		points: Position[];	// 要显示在可视区域内的坐标点列表，[{latitude, longitude}]
		padding?: [number, number, number, number];	// 坐标点形成的矩形边缘到地图边缘的距离，单位像素。格式为[上,右,下,左]，安卓上只能识别数组第一项，上下左右的padding一致。开发者工具暂不支持padding参数。
	}

	interface GetRegionOptions extends BaseOptions {
		success?(res: {
			southwest: number;	// 西南角的经纬度
			northeast: number;	// 东北角的经纬度
		}): void;
	}

	interface GetScaleOptions extends BaseOptions {
		success?(res: {
			scale: number;
		}): void;
	}
	/**
	 * mapContext 通过 mapId 跟一个 <map/> 组件绑定，通过它可以操作对应的 <map/> 组件。
	 */
	interface MapContext {
		/**
		 * 获取当前地图中心的经纬度，返回的是 gcj02 坐标系，可以用于 wx.openLocation
		 */
		getCenterLocation(options: GetCenterLocationOptions): OpenLocationOptions;
		/**
		 * 将地图中心移动到当前定位点，需要配合map组件的show-location使用
		 */
		moveToLocation(): void;
		translateMarker(options: TranslateMarkerOptions): void;	// 平移marker，带动画
		includePoints(options: IncludePointsOptions): void;	// 缩放视野展示所有经纬度
		getRegion(options: GetRegionOptions): void;	// 获取当前地图的视野范围
		getScale(options: GetScaleOptions): void;	// 获取当前地图的缩放级别
	}
	/**
	 * 创建并返回 map 上下文 mapContext 对象
	 */
	function createMapContext(mapId: string, _this?: any): MapContext;
}

// 设备-----系统信息
declare namespace wx {
	interface SystemInfo {
		brand: string;	// 手机品牌
		/** 手机型号 */
		model: string;
		/** 设备像素比 */
		pixelRatio: number;
		screenWidth: number;	// 屏幕宽度
		screenHeight: number;	// 屏幕高度
		/** 窗口宽度 */
		windowWidth: number;
		/** 窗口高度 */
		windowHeight: number;
		/** 微信设置的语言 */
		language: string;
		/** 微信版本号 */
		version: string;
		system: string;		// 操作系统版本
		platform: string;	// 客户端平台
		fontSizeSetting: string;	// 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px
		SDKVersion: string;	// 客户端基础库版本
	}
	interface GetSystemInfoOptions extends BaseOptions {
		/** 成功获取系统信息的回调 */
		success(res: SystemInfo): void;
	}
	/**
	 * 获取系统信息。
	 */
	function getSystemInfo(options: GetSystemInfoOptions): void;
	function getSystemInfoSync(): SystemInfo;

	/**
	 * 判断小程序的API，回调，参数，组件等是否在当前版本可用。
	 * 参数说明： 使用${API}.${method}.${param}.${options}或者${component}.${attribute}.${option}方式来调用，例如：
	 * ${API} 代表 API 名字
	 * ${method} 代表调用方式，有效值为return, success, object, callback
	 * ${param} 代表参数或者返回值
	 * ${options} 代表参数的可选值
	 * ${component} 代表组件名字
	 * ${attribute} 代表组件属性
	 * ${option} 代表组件属性的可选值
	 */
	function canIUse(w: string): boolean;
}

// 设备-----网络状态
declare namespace wx {
	type networkType = '2g' | '3g' | '4g' | 'wifi' | 'unknown' | 'none';
	interface NetworkTypeData {
		/** 返回网络类型2g，3g，4g，wifi */
		networkType: networkType;
	}
	interface GetNetworkTypeOptions extends BaseOptions {
		/** 接口调用成功，返回网络类型 networkType */
		success(res: NetworkTypeData): void;
	}
	/**
	 * 获取网络类型。
	 */
	function getNetworkType(options: GetNetworkTypeOptions): void;

	/**
	 * 监听网络状态变化。
	 * 基础库版本 1.1.0 开始支持，低版本需做兼容处理
	 * 微信客户端 6.5.6 版本开始支持
	 */
	function onNetworkStatusChange(callback: (res: {
		isConnected: boolean;
		networkType: networkType;
	}) => void): void;
}

// 设备-----加速度计
declare namespace wx {
	interface AccelerometerData {
		/** X 轴 */
		x: number;
		/** Y 轴 */
		y: number;
		/** Z 轴 */
		z: number;
	}
	type AccelerometerChangeCallback = (res: AccelerometerData) => void;
	/**
	 * 监听重力感应数据，频率：5次/秒
	 */
	function onAccelerometerChange(callback: AccelerometerChangeCallback): void;

	type AccelerometerOptions = BaseOptions;
	/**
	 * 开始监听加速度数据。
	 * 基础库版本 1.1.0 开始支持，低版本需做兼容处理
	 * 微信客户端 6.5.6 版本开始支持
	 */
	function startAccelerometer(options: AccelerometerOptions): void;
	/**
	 * 停止监听加速度数据。
	 * 基础库版本 1.1.0 开始支持，低版本需做兼容处理
	 * 微信客户端 6.5.6 版本开始支持
	 */
	function stopAccelerometer(options: AccelerometerOptions): void;
}

// 设备-----罗盘
declare namespace wx {
	interface CompassData {
		/** 面对的方向度数 */
		direction: number;
	}
	type CompassChangeCallback = (res: CompassData) => void;
	/**
	 * 监听罗盘数据，频率：5次/秒，接口调用后会自动开始监听，可使用wx.stopCompass停止监听。
	 */
	function onCompassChange(callback: CompassChangeCallback): void;
	type CompassOptions = BaseOptions;
	/**
	 * 开始监听罗盘数据。
	 * 基础库版本 1.1.0 开始支持，低版本需做兼容处理
	 * 微信客户端 6.5.6 版本开始支持
	 */
	function startCompass(options: CompassOptions): void;
	function stopCompass(options: CompassOptions): void;
}

// 设备-----拨打电话
declare namespace wx {
	interface MakePhoneCallOptions extends BaseOptions {
		/**
		 * 需要拨打的电话号码
		 */
		phoneNumber: string;
	}
	/**
	 * 拨打电话
	 */
	function makePhoneCall(options: MakePhoneCallOptions): void;
}

// 设备-----扫码
declare namespace wx {
	type scanType = "qrCode" | "barCode" | "datamatrix" | "pdf417";
	interface ScanCodeData {
		/**
		 * 所扫码的内容
		 */
		result: string;
		/**
		 * 所扫码的类型
		 */
		scanType: scanType;
		/**
		 * 所扫码的字符集
		 */
		charSet: string;
		/**
		 * 当所扫的码为当前小程序的合法二维码时，会返回此字段，内容为二维码携带的 path
		 */
		path: string;
	}
	interface ScanCodeOptions extends BaseOptions {
		onlyFromCamera?: boolean;	// 是否只能从相机扫码，不允许从相册选择图片
		scanType?: scanType[];	// 扫码类型，参数类型是数组，二维码是'qrCode'，一维码是'barCode'，DataMatrix是‘datamatrix’，pdf417是‘pdf417’。
		success?(res: ScanCodeData): void;
	}
	/**
	 * 调起客户端扫码界面，扫码成功后返回对应的结果
	 */
	function scanCode(options: ScanCodeOptions): void;
}

// 设备-----剪贴板
declare namespace wx {
	interface SetClipboardDataOptions extends BaseOptions {
		data: string;
	}
	/**
	 * 设置系统剪贴板的内容
	 * 基础库版本 1.1.0 开始支持，低版本需做兼容处理
	 * 微信客户端 6.5.6 版本开始支持
	 */
	function setClipboardData(options: SetClipboardDataOptions): void;
	interface GetClipboardDataOptions extends BaseOptions {
		success?(res: DataResponse): void;
	}
	/**
	 * 获取系统剪贴板内容
	 * 基础库版本 1.1.0 开始支持，低版本需做兼容处理
	 * 微信客户端 6.5.6 版本开始支持
	 */
	function getClipboardData(options: GetClipboardDataOptions): void;
}

// 设备-----蓝牙
declare namespace wx {
	interface OpenBluetoothAdapterOptions extends BaseOptions {
		success(res: any): void;
	}
	/**
	 * 初始化蓝牙适配器
	 */
	function openBluetoothAdapter(options: OpenBluetoothAdapterOptions): void;
	interface CloseBluetoothAdapterOptions extends BaseOptions {
		success(res: any): void;
	}
	/**
	 * 关闭蓝牙模块。调用该方法将断开所有已建立的链接并释放系统资源
	 */
	function closeBluetoothAdapter(options: CloseBluetoothAdapterOptions): void;
	interface BluetoothAdapterState {
		/**
		 * 蓝牙适配器是否可用
		 */
		available: boolean;
		/**
		 * 蓝牙适配器是否处于搜索状态
		 */
		discovering: boolean;
	}
	interface BluetoothAdapterStateData extends ErrMsgResponse {
		/**
		 * 蓝牙适配器信息
		 */
		adapterState: BluetoothAdapterState;
	}
	interface GetBluetoothAdapterStateOptions extends BaseOptions {
		success(res: BluetoothAdapterStateData): void;
	}
	/**
	 * 获取本机蓝牙适配器状态
	 */
	function getBluetoothAdapterState(options: GetBluetoothAdapterStateOptions): void;
	/**
	 * 监听蓝牙适配器状态变化事件
	 */
	function onBluetoothAdapterStateChange(callback: (res: BluetoothAdapterState) => void): void;
	interface StartBluetoothDevicesDiscoveryOptions extends BaseOptions {
		allowDuplicatesKey?: boolean;	// 是否允许重复上报同一设备， 如果允许重复上报，则onDeviceFound 方法会多次上报同一设备，但是 RSSI 值会有不同
		interval?: number;	// 上报设备的间隔，默认为0，意思是找到新设备立即上报，否则根据传入的间隔上报
		success(res: ErrMsgResponse): void;
		/**
		 * 蓝牙设备主 service 的 uuid 列表
		 * 某些蓝牙设备会广播自己的主 service 的 uuid。如果这里传入该数组，那么根据该 uuid 列表，只搜索有这个主服务的设备。
		 */
		services?: string[];
	}
	/**
	 * 开始搜寻附近的蓝牙外围设备。注意，该操作比较耗费系统资源，请在搜索并连接到设备后调用 stop 方法停止搜索。
	 * @example
	 * // 以微信硬件平台的蓝牙智能灯为例，主服务的 UUID 是 FEE7。传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
	 * wx.startBluetoothDevicesDiscovery({
	 * 	services: ['FEE7'],
	 * 	success: function (res) {
	 * 		console.log(res)
	 * 	}
	 * });
	 */
	function startBluetoothDevicesDiscovery(options: StartBluetoothDevicesDiscoveryOptions): void;
	interface StopBluetoothDevicesDiscoveryOptions extends BaseOptions {
		success(res: ErrMsgResponse): void;
	}
	/**
	 * 停止搜寻附近的蓝牙外围设备。请在确保找到需要连接的设备后调用该方法停止搜索。
	 */
	function stopBluetoothDevicesDiscovery(options: StopBluetoothDevicesDiscoveryOptions): void;

	/**
	 * 蓝牙设备信息
	 */
	interface BluetoothDevice {
		/**
		 * 蓝牙设备名称，某些设备可能没有
		 */
		name: string;
		/**
		 * 用于区分设备的 id
		 */
		deviceId: string;
		/**
		 * int 当前蓝牙设备的信号强度
		 */
		RSSI: number;
		/**
		 * 当前蓝牙设备的广播内容
		 */
		advertisData: ArrayBuffer;
		advertisServiceUUIDs: string[];	// 当前蓝牙设备的广播数据段中的ServiceUUIDs数据段
		localName: string;	//	当前蓝牙设备的广播数据段中的LocalName数据段
	}

	interface GetBluetoothDevicesResponse extends ErrMsgResponse {
		devices: BluetoothDevice[];
	}

	interface GetBluetoothDevicesOptions extends BaseOptions {
		success(res: GetBluetoothDevicesResponse): void;
	}
	/**
	 * 获取所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备
	 */
	function getBluetoothDevices(options: GetBluetoothDevicesOptions): void;
	/**
	 * 监听寻找到新设备的事件
	 */
	function onBluetoothDeviceFound(callback: (res: {
		devices: BluetoothDevice[];
	}) => void): void;

	interface GetConnectedBluetoothDevicesResponse extends ErrMsgResponse {
		devices: BluetoothDevice[];
	}

	interface GetConnectedBluetoothDevicesOptions extends BaseOptions {
		services: string[];
		success(res: GetConnectedBluetoothDevicesResponse): void;
	}
	/**
	 * 根据 uuid 获取处于已连接状态的设备
	 */
	function getConnectedBluetoothDevices(options: GetConnectedBluetoothDevicesOptions): void;

	interface CreateBLEConnectionOptions extends BaseOptions {
		deviceId: string;	// 蓝牙设备 id，参考 getDevices 接口
		success(res: ErrMsgResponse): void;
	}
	/**
	 * 低功耗蓝牙接口
	 */
	function createBLEConnection(options: CreateBLEConnectionOptions): void;

	interface CloseBLEConnectionOptions extends BaseOptions {
		/**
		 * 蓝牙设备 id，参考 getDevices 接口
		 */
		deviceId: string;
		success(res: ErrMsgResponse): void;
	}
	/**
	 * 断开与低功耗蓝牙设备的连接
	 */
	function closeBLEConnection(options: CloseBLEConnectionOptions): void;

	interface GetBLEDeviceServicesResponse extends ErrMsgResponse {
		services: Array<{
			uuid: string;
			isPrimary: boolean;
		}>;
	}

	interface GetBLEDeviceServicesOptions extends BaseOptions {
		/**
		 * 蓝牙设备 id，参考 getDevices 接口
		 */
		deviceId: string;
		/**
		 * 成功则返回本机蓝牙适配器状态
		 */
		success(res: GetBLEDeviceServicesResponse): void;
	}
	/**
	 * 获取蓝牙设备所有 service（服务）
	 */
	function getBLEDeviceServices(options: GetBLEDeviceServicesOptions): void;

	interface GetBLEDeviceCharacteristicsReponse extends ErrMsgResponse {
		characteristics: Array<{
			uuid: string;
			properties: Array<{
				/**
				 * 该特征值是否支持 read 操作
				 */
				read: boolean;
				/**
				 * 该特征值是否支持 write 操作
				 */
				write: boolean;
				/**
				 * 该特征值是否支持 notify 操作
				 */
				notify: boolean;
				/**
				 * 该特征值是否支持 indicate 操作
				 */
				indicate: boolean;
			}>;
		}>;
	}

	interface GetBLEDeviceCharacteristicsOptions extends BaseOptions {
		/**
		 * 蓝牙设备 id，参考 device 对象
		 */
		deviceId: string;
		/**
		 * 蓝牙服务 uuid
		 */
		serviceId: string;
		/**
		 * 成功则返回本机蓝牙适配器状态
		 */
		success(res: GetBLEDeviceCharacteristicsReponse): void;
	}
	/**
	 * 获取蓝牙设备所有 characteristic（特征值）
	 */
	function getBLEDeviceCharacteristics(options: GetBLEDeviceCharacteristicsOptions): void;

	interface BLECharacteristicValueOptions extends BaseOptions {
		/**
		 * 蓝牙设备 id，参考 device 对象
		 */
		deviceId: string;
		/**
		 * 蓝牙特征值对应服务的 uuid
		 */
		serviceId: string;
		/**
		 * 蓝牙特征值的 uuid
		 */
		characteristicId: string;
	}

	interface Characteristic {
		/**
		 * 蓝牙设备特征值的 uuid
		 */
		characteristicId: string;
		/**
		 * 蓝牙设备特征值对应服务的 uuid
		 */
		serviceId: string;
		/**
		 * 蓝牙设备特征值对应的二进制值
		 */
		value: ArrayBuffer;
	}

	interface ReadBLECharacteristicValueResponse extends ErrMsgResponse {
		characteristic: Characteristic;
	}

	interface ReadBLECharacteristicValueOptions extends BLECharacteristicValueOptions {
		success(res: ReadBLECharacteristicValueResponse): void;
	}
	/**
	 * 读取低功耗蓝牙设备的特征值的二进制数据值。
	 * 注意：必须设备的特征值支持read才可以成功调用，具体参照 characteristic 的 properties 属性
	 */
	function readBLECharacteristicValue(options: ReadBLECharacteristicValueOptions): void;

	interface WriteBLECharacteristicValueOptions extends BLECharacteristicValueOptions {
		value: ArrayBuffer;	// 蓝牙设备特征值对应的二进制值
		success(res: ErrMsgResponse): void;
	}
	/**
	 * 向低功耗蓝牙设备特征值中写入二进制数据。
	 * 注意：必须设备的特征值支持write才可以成功调用，具体参照 characteristic 的 properties 属性
	 * tips: 并行调用多次读写接口存在读写失败的可能性
	 */
	function writeBLECharacteristicValue(options: WriteBLECharacteristicValueOptions): void;

	interface NotifyBLECharacteristicValueChangeOptions extends BLECharacteristicValueOptions {
		state: boolean;	// true: 启用 notify; false: 停用 notify
		success(ret: ErrMsgResponse): void;	// 成功则返回本机蓝牙适配器状态
	}
	/**
	 * 启用低功耗蓝牙设备特征值变化时的 notify 功能。
	 * 注意：必须设备的特征值支持notify才可以成功调用，具体参照 characteristic 的 properties 属性
	 * 另外，必须先启用notify才能监听到设备 characteristicValueChange 事件
	 */
	function notifyBLECharacteristicValueChange(options: NotifyBLECharacteristicValueChangeOptions): void;
	/**
	 * 监听低功耗蓝牙连接的错误事件，包括设备丢失，连接异常断开等等。
	 */
	function onBLEConnectionStateChange(callback: (res: {
		/**
		 * 蓝牙设备 id，参考 device 对象
		 */
		deviceId: string;
		/**
		 * 连接目前的状态
		 */
		connected: boolean;
	}) => void): void;
	/**
	 * 监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification。
	 */
	function onBLECharacteristicValueChange(callback: (
		res: {
			/**
			 * 蓝牙设备 id，参考 device 对象
			 */
			deviceId: string;
			/**
			 * 特征值所属服务 uuid
			 */
			serviceId: string;
			/**
			 * 特征值 uuid
			 */
			characteristicId: string;
			/**
			 * 特征值最新的值
			 */
			value: ArrayBuffer;
		}
	) => void): void;
}

// 设备-----iBeacon
declare namespace wx {
	interface StartBeaconOptions extends BaseOptions {
		uuids: string[];	// iBeacon设备广播的 uuids
		success?(ret: { errMsg: string; }): void;
	}
	/**
	 * 开始搜索附近的iBeacon设备
	 */
	function startBeaconDiscovery(options: StartBeaconOptions): void;

	interface StopBeaconOptions extends BaseOptions {
		success?(ret: { errMsg: string; }): void;
	}
	/**
	 * 停止搜索附近的iBeacon设备
	 */
	function stopBeaconDiscovery(options: StopBeaconOptions): void;

	interface Beacon {
		uuid?: string;	// iBeacon 设备广播的 uuid
		major?: string;	// iBeacon 设备的主 id
		minor?: string;	// iBeacon 设备的次 id
		proximity: number;	// 表示设备距离的枚举值
		accuracy: number;	// iBeacon 设备的距离
		rssi: number;	// 表示设备的信号强度
	}

	interface GetBeaconOptions extends BaseOptions {
		success?(ret: { beacons: Beacon[]; errMsg?: string; }): void;
	}
	/**
	 * 获取所有已搜索到的iBeacon设备
	 */
	function getBeacons(options: GetBeaconOptions): void;

	function onBeaconUpdate(callback: (beacons: Beacon[]) => void): void;
	function onBeaconServiceChange(callback: (res: {
		available: boolean;
		discovering: boolean;
	}) => void): void;
}

// 设备-----屏幕亮度
declare namespace wx {
	interface SetScreenBrightnessOptions extends BaseOptions {
		value: number;	// 屏幕亮度值，范围 0~1，0 最暗，1 最亮
	}

	/**
	 * 设置屏幕亮度。
	 */
	function setScreenBrightness(options: SetScreenBrightnessOptions): void;

	interface GetScreenBrightnessOptions extends BaseOptions {
		/**
		 * @param value 屏幕亮度值，范围 0~1，0 最暗，1 最亮
		 */
		success?(ret: { value: number; }): void;
	}

	/**
	 * 获取屏幕亮度。
	 * 若安卓系统设置中开启了自动调节亮度功能，则屏幕亮度会根据光线自动调整，该接口仅能获取自动调节亮度之前的值，而非实时的亮度值。
	 */
	function getScreenBrightness(options: GetScreenBrightnessOptions): void;

	interface SetKeepScreenOnOptions extends BaseOptions {
		keepScreenOn: boolean;
		success(errMsg: string): void;
	}
	function setKeepScreenOn(options: SetKeepScreenOnOptions): void;
}

// 设备-----用户截屏事件
declare namespace wx {
	function onUserCaptureScreen(callback: () => void): void;
}

// 设备-----振动
declare namespace wx {
	/**
	 * 使手机发生较长时间的振动（400ms）
	 */
	function vibrateLong(options: BaseOptions): void;
	/**
	 * 使手机发生较短时间的振动（15ms）
	 * 仅在 iPhone7/iPhone7Plus 及 Android 机型生效
	 */
	function vibrateShort(options: BaseOptions): void;
}

// 设备-----手机联系人
declare namespace wx {
	interface PhoneContact extends BaseOptions {
		photoFilePath?: string;	// 头像本地文件路径
		nickName?: string;	// 昵称
		lastName?: string;	// 姓氏
		middleName?: string;	// 中间名
		firstName: string;	// 名字
		remark?: string;	// 备注
		mobilePhoneNumber?: string;	// 手机号
		weChatNumber?: string;	// 微信号
		addressCountry?: string;	// 联系地址国家
		addressState?: string;	// 联系地址省份
		addressCity?: string;	// 联系地址城市
		addressStreet?: string;	// 联系地址街道
		addressPostalCode?: string;	// 联系地址邮政编码
		organization?: string;	// 公司
		title?: string;	// 职位
		workFaxNumber?: string;	// 工作传真
		workPhoneNumber?: string;	// 工作电话
		hostNumber?: string;	// 公司电话
		email?: string;	// 电子邮件
		url?: string;	// 网站
		workAddressCountry?: string;	// 工作地址国家
		workAddressState?: string;	// 工作地址省份
		workAddressCity?: string;	// 工作地址城市
		workAddressStreet?: string;	// 工作地址街道
		workAddressPostalCode?: string;	// 工作地址邮政编码
		homeFaxNumber?: string;	// 住宅传真
		homePhoneNumber?: string;	// 住宅电话
		homeAddressCountry?: string;	// 住宅地址国家
		homeAddressState?: string;	// 住宅地址省份
		homeAddressCity?: string;	// 住宅地址城市
		homeAddressStreet?: string;	// 住宅地址街道
		homeAddressPostalCode?: string;	// 住宅地址邮政编码
	}
	function addPhoneContact(options: PhoneContact): void;
}

// 界面-----交互反馈
declare namespace wx {
	interface ToastOptions extends BaseOptions {
		/**
		 * 提示的内容
		 */
		title: string;
		/**
		 * 图标，只支持"success"、"loading"
		 */
		icon?: 'success' | 'loading';
		/**
		 * 自定义图标的本地路径，image 的优先级高于 icon
		 */
		image?: string;
		/**
		 * 提示的延迟时间，单位毫秒，默认：1500
		 */
		duration?: number;
		/**
		 * 是否显示透明蒙层，防止触摸穿透，默认：false
		 */
		mask?: boolean;
	}
	/**
	 * 显示消息提示框
	 */
	function showToast(options: ToastOptions): void;
	function hideToast(): void;

	interface LoadingOptions extends BaseOptions {
		/**
		 * 提示的内容
		 */
		title: string;
		/**
		 * 是否显示透明蒙层，防止触摸穿透，默认：false
		 */
		mask?: boolean;
	}
	/**
	 * 显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框
	 */
	function showLoading(options: LoadingOptions): void;
	/**
	 * 隐藏消息提示框
	 */
	function hideLoading(): void;

	interface ModalOptions extends BaseOptions {
		/**
		 * 提示的标题
		 */
		title: string;
		/**
		 * 提示的内容
		 */
		content: string;
		/**
		 * 是否显示取消按钮，默认为 true
		 */
		showCancel?: boolean;
		/**
		 * 取消按钮的文字，默认为"取消"，最多 4 个字符
		 */
		cancelText?: string;
		/**
		 * 取消按钮的文字颜色，默认为"#000000"
		 */
		cancelColor?: string;
		/**
		 * 确定按钮的文字，默认为"确定"，最多 4 个字符
		 */
		confirmText?: string;
		/**
		 * 确定按钮的文字颜色，默认为"#3CC51F"
		 */
		confirmColor?: string;
		success?(res: {
			/**
			 * 为 true 时，表示用户点击了确定按钮
			 */
			confirm: boolean;
			/**
			 * 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）
			 */
			cancel: boolean;
		}): void;
	}
	/**
	 * 显示模态弹窗
	 */
	function showModal(options: ModalOptions): void;

	interface ActionSheetOptions extends BaseOptions {
		/**
		 * 按钮的文字数组，数组长度最大为6个
		 */
		itemList: string[];
		/**
		 * 按钮的文字颜色，默认为"#000000"
		 */
		itemColor?: string;
		/**
		 * 接口调用成功的回调函数
		 */
		success?(res: {
			/**
			 * 用户点击的按钮，从上到下的顺序，从0开始
			 */
			tapIndex: number;
		}): void;
	}
	/**
	 * 显示操作菜单
	 */
	function showActionSheet(options: ActionSheetOptions): void;
}

// 界面-----设置导航条
declare namespace wx {
	interface SetNavigationBarTitleOptions extends BaseOptions {
		/** 页面标题 */
		title?: string;
	}
	/**
	 * 动态设置当前页面的标题。
	 */
	function setNavigationBarTitle(options: SetNavigationBarTitleOptions): void;

	/**
	 * 在当前页面显示导航条加载动画。
	 */
	function showNavigationBarLoading(): void;
	/**
	 * 隐藏导航条加载动画。
	 */
	function hideNavigationBarLoading(): void;
	type AnimationTimingFunc =
		'linear'		// 动画从头到尾的速度是相同的
		| 'easeIn'		// 动画以低速开始
		| 'easeOut'		// 动画以低速结束。
		| 'easeInOut'	// 动画以低速开始和结束。
		;
	interface SetNavigationBarColorOptions extends BaseOptions {
		frontColor: '#ffffff' | '#000000';	// 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
		backgroundColor: string;	// 背景颜色值，有效值为十六进制颜色
		animation?: Partial<{		// 动画效果
			duration: number;					// 动画变化时间，默认0，单位：毫秒
			timingFunc: AnimationTimingFunc;	// 动画变化方式，默认 linear
		}>;
		success?(res: {
			errMsg: string;	// 调用结果
		}): void;
	}
	function setNavigationBarColor(options: SetNavigationBarColorOptions): void;
}

declare namespace wx {
	interface SetTopBarTextOptions extends BaseOptions {
		text: string;	// 置顶栏文字内容
	}
	function setTopBarText(options: SetTopBarTextOptions): void;
}

// 界面-----导航
declare namespace wx {
	interface NavigateToOptions extends BaseOptions {
		/** 需要跳转的应用内页面的路径 */
		url: string;
	}
	/**
	 * 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
	 *
	 * 注意：为了不让用户在使用小程序时造成困扰，
	 * 我们规定页面路径只能是五层，请尽量避免多层级的交互方式。
	 */
	function navigateTo(options: NavigateToOptions): void;

	interface RedirectToOptions extends BaseOptions {
		/** 需要跳转的应用内页面的路径 */
		url: string;
	}
	/**
	 * 关闭当前页面，跳转到应用内的某个页面。
	 */
	function redirectTo(options: RedirectToOptions): void;

	interface SwichTabOptions extends BaseOptions {
		url: string;	// 需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数
	}
	/**
	 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
	 */
	function switchTab(options: SwichTabOptions): void;

	interface NavigateBackOptions extends BaseOptions {
		delta?: number;	// 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
	}

	/**
	 * 关闭当前页面，回退前一页面。
	 */
	function navigateBack(options?: NavigateBackOptions): void;

	interface RelaunchOptions extends BaseOptions {
		url: string;	// 需要跳转的应用内页面路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'，如果跳转的页面路径是 tabBar 页面则不能带参数
	}

	/**
	 * 关闭所有页面，打开到应用内的某个页面。
	 */
	function reLaunch(options?: RelaunchOptions): void;
}

// 界面-----动画
declare namespace wx {
	type TimingFunction = 'linear' | 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'step-start' | 'step-end';

	interface CreateAnimationOptions {
		/** 动画持续时间，单位ms，默认值 400 */
		duration?: number;
		/** 定义动画的效果，默认值"linear"，有效值："linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end" */
		timingFunction?: TimingFunction;
		/** 动画持续时间，单位 ms，默认值 0 */
		delay?: number;
		/** 设置transform-origin，默认为"50% 50% 0" */
		transformOrigin?: string;
	}

	interface Animator {
		actions: AnimationAction[];
	}
	interface AnimationAction {
		animates: Animate[];
		option: AnimationActionOption;
	}
	interface AnimationActionOption {
		transformOrigin: string;
		transition: AnimationTransition;
	}
	interface AnimationTransition {
		delay: number;
		duration: number;
		timingFunction: TimingFunction;
	}
	interface Animate {
		type: string;
		args: any[];
	}

	/**
	 * 创建一个动画实例animation。调用实例的方法来描述动画。
	 * 最后通过动画实例的export方法导出动画数据传递给组件的animation属性。
	 *
	 * 注意: export 方法每次调用后会清掉之前的动画操作
	 */
	function createAnimation(options?: CreateAnimationOptions): Animation;
	/** 动画实例可以调用以下方法来描述动画，调用结束后会返回自身，支持链式调用的写法。 */
	interface Animation {
		/**
		 * 调用动画操作方法后要调用 step() 来表示一组动画完成，
		 * 可以在一组动画中调用任意多个动画方法，
		 * 一组动画中的所有动画会同时开始，
		 * 一组动画完成后才会进行下一组动画。
		 * @param {CreateAnimationOptions} options 指定当前组动画的配置
		 */
		step(options?: CreateAnimationOptions): void;
		/**
		 * 导出动画操作
		 *
		 * 注意: export 方法每次调用后会清掉之前的动画操作
		 */
		export(): Animator;

		/** 透明度，参数范围 0~1 */
		opacity(value: number): Animation;
		/** 颜色值 */
		backgroundColor(color: string): Animation;
		/** 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值 */
		width(length: number): Animation;
		/** 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值 */
		height(length: number): Animation;
		/** 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值 */
		top(length: number): Animation;
		/** 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值 */
		left(length: number): Animation;
		/** 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值 */
		bottom(length: number): Animation;
		/** 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值 */
		right(length: number): Animation;

		/** deg的范围-180~180，从原点顺时针旋转一个deg角度 */
		rotate(deg: number): Animation;
		/** deg的范围-180~180，在X轴旋转一个deg角度 */
		rotateX(deg: number): Animation;
		/** deg的范围-180~180，在Y轴旋转一个deg角度 */
		rotateY(deg: number): Animation;
		/** deg的范围-180~180，在Z轴旋转一个deg角度 */
		rotateZ(deg: number): Animation;
		/** 同transform-function rotate3d */
		rotate3d(x: number, y: number, z: number, deg: number): Animation;

		/**
		 * 一个参数时，表示在X轴、Y轴同时缩放sx倍数；
		 * 两个参数时表示在X轴缩放sx倍数，在Y轴缩放sy倍数
		 */
		scale(sx: number, sy?: number): Animation;
		/** 在X轴缩放sx倍数 */
		scaleX(sx: number): Animation;
		/** 在Y轴缩放sy倍数 */
		scaleY(sy: number): Animation;
		/** 在Z轴缩放sy倍数 */
		scaleZ(sz: number): Animation;
		/** 在X轴缩放sx倍数，在Y轴缩放sy倍数，在Z轴缩放sz倍数 */
		scale3d(sx: number, sy: number, sz: number): Animation;

		/**
		 * 一个参数时，表示在X轴偏移tx，单位px；
		 * 两个参数时，表示在X轴偏移tx，在Y轴偏移ty，单位px。
		 */
		translate(tx: number, ty?: number): Animation;
		/**
		 * 在X轴偏移tx，单位px
		 */
		translateX(tx: number): Animation;
		/**
		 * 在Y轴偏移tx，单位px
		 */
		translateY(ty: number): Animation;
		/**
		 * 在Z轴偏移tx，单位px
		 */
		translateZ(tz: number): Animation;
		/**
		 * 在X轴偏移tx，在Y轴偏移ty，在Z轴偏移tz，单位px
		 */
		translate3d(tx: number, ty: number, tz: number): Animation;

		/**
		 * 参数范围-180~180；
		 * 一个参数时，Y轴坐标不变，X轴坐标延顺时针倾斜ax度；
		 * 两个参数时，分别在X轴倾斜ax度，在Y轴倾斜ay度
		 */
		skew(ax: number, ay?: number): Animation;
		/** 参数范围-180~180；Y轴坐标不变，X轴坐标延顺时针倾斜ax度 */
		skewX(ax: number): Animation;
		/** 参数范围-180~180；X轴坐标不变，Y轴坐标延顺时针倾斜ay度 */
		skewY(ay: number): Animation;

		/**
		 * 同transform-function matrix
		 */
		matrix(a: number, b: number, c: number, d: number, tx: number, ty: number): Animation;
		/** 同transform-function matrix3d */
		matrix3d(
			a1: number, b1: number, c1: number, d1: number, a2: number,
			b2: number, c2: number, d2: number, a3: number, b3: number,
			c3: number, d3: number, a4: number, b4: number, c4: number,
			d4: number
		): Animation;
	}
}

// 界面-----位置
declare namespace wx {
	function pageScrollTo(options: {
		scrollTop: number;	// 滚动到页面的目标位置（单位px）
	}): void;
}

// 界面-----绘图
declare namespace wx {
	interface CanvasAction {
		method: string;
		data: CanvasAction[] | Array<number | string>;
	}
	type LineCapType = 'butt' | 'round' | 'square';
	type LineJoinType = 'bevel' | 'round' | 'miter';
	/**
	 * context只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>。
	 */
	interface CanvasContext {
		/** 获取当前context上存储的绘图动作(不推荐使用) */
		getActions(): CanvasAction[];
		/** 清空当前的存储绘图动作(不推荐使用) */
		clearActions(): void;
		/**
		 * 对横纵坐标进行缩放
		 * 在调用scale方法后，之后创建的路径其横纵坐标会被缩放。
		 * 多次调用scale，倍数会相乘。
		 *
		 * @param {number} scaleWidth 横坐标缩放的倍数
		 * @param {number} scaleHeight 纵坐标轴缩放的倍数
		 */
		scale(scaleWidth: number, scaleHeight?: number): void;
		/**
		 * 对坐标轴进行顺时针旋转
		 * 以原点为中心，原点可以用 translate方法修改。
		 * 顺时针旋转当前坐标轴。多次调用rotate，旋转的角度会叠加。
		 *
		 * @param {number} rotate 旋转角度，以弧度计。
		 */
		rotate(rotate: number): void;
		/**
		 * 对坐标原点进行缩放
		 * 对当前坐标系的原点(0, 0)进行变换，默认的坐标系原点为页面左上角。
		 *
		 * @param {number} x 水平坐标平移量
		 * @param {number} y 竖直坐标平移量
		 */
		translate(x: number, y: number): void;
		/**
		 * 保存当前的绘图上下文。
		 */
		save(): void;
		/**
		 * 恢复之前保存的绘图上下文。
		 */
		restore(): void;
		/**
		 * 在给定的矩形区域内，清除画布上的像素
		 * 清除画布上在该矩形区域内的内容。
		 *
		 * @param {number} x 矩形区域左上角的x坐标
		 * @param {number} y 矩形区域左上角的y坐标
		 * @param {number} width 矩形区域的宽度
		 * @param {number} height 矩形区域的高度
		 */
		clearRect(x: number, y: number, width: number, height: number): void;
		/**
		 * 在画布上绘制被填充的文本
		 *
		 * @param {string} text 在画布上输出的文本
		 * @param {number} x 绘制文本的左上角x坐标位置
		 * @param {number} y 绘制文本的左上角y坐标位置
		 */
		fillText(text: string, x: number, y: number): void;
		/**
		 * 用于设置文字的对齐
		 *
		 * @param {('left' | 'center' | 'right')} align
		 *
		 * @memberOf CanvasContext
		 */
		setTextAlign(align: 'left' | 'center' | 'right'): void;
		/**
		 * 绘制图像，图像保持原始尺寸。
		 *
		 * @param {string} imageResource 所要绘制的图片资源。 通过chooseImage得到一个文件路径或者一个项目目录内的图片
		 * @param {number} x 图像左上角的x坐标
		 * @param {number} y 图像左上角的y坐标
		 * @param {number} width 图像宽度
		 * @param {number} height 图像高度
		 *
		 * @memberOf CanvasContext
		 */
		drawImage(imageResource: string, x: number, y: number, width: number, height: number): void;
		/**
		 * 设置全局画笔透明度。
		 *
		 * @param {number} alpha 0~1	透明度，0 表示完全透明，1 表示完全不透明
		 *
		 * @memberOf CanvasContext
		 */
		setGlobalAlpha(alpha: number): void;
		/**
		 * 对当前路径进行填充
		 */
		fill(): void;
		/**
		 * 对当前路径进行描边
		 */
		stroke(): void;
		/**
		 * 开始创建一个路径，需要调用fill或者stroke才会使用路径进行填充或描边。
		 * Tip: 在最开始的时候相当于调用了一次 beginPath()。
		 * Tip: 同一个路径内的多次setFillStyle、setStrokeStyle、setLineWidth等设置，
		 * 以最后一次设置为准。
		 */
		beginPath(): void;
		/**
		 * 关闭一个路径
		 * Tip: 关闭路径会连接起点和终点。
		 * Tip: 如果关闭路径后没有调用 fill() 或者 stroke() 并开启了新的路径，那之前的路径将不会被渲染。
		 */
		closePath(): void;
		/**
		 * 把路径移动到画布中的指定点，但不创建线条。
		 *
		 * @param {number} x 目标位置的x坐标
		 * @param {number} y 目标位置的y坐标
		 */
		moveTo(x: number, y: number): void;
		/**
		 * 在当前位置添加一个新点，然后在画布中创建从该点到最后指定点的路径。
		 *
		 * @param {number} x 目标位置的x坐标
		 * @param {number} y 目标位置的y坐标
		 */
		lineTo(x: number, y: number): void;
		/**
		 * 添加一个矩形路径到当前路径。
		 *
		 * @param {number} x 矩形路径左上角的x坐标
		 * @param {number} y 矩形路径左上角的y坐标
		 * @param {number} width 矩形路径的宽度
		 * @param {number} height 矩形路径的高度
		 */
		rect(x: number, y: number, width: number, height: number): void;

		/**
		 * 填充一个矩形。
		 * Tip: 用 setFillStyle() 设置矩形的填充色，如果没设置默认是黑色。
		 * @param {number} x 矩形路径左上角的x坐标
		 * @param {number} y 矩形路径左上角的y坐标
		 * @param {number} width 矩形路径的宽度
		 * @param {number} height 矩形路径的高度
		 *
		 * @memberOf CanvasContext
		 */
		fillRect(x: number, y: number, width: number, height: number): void;
		/**
		 * 画一个矩形(非填充)。
		 * Tip: 用 setFillStroke() 设置矩形线条的颜色，如果没设置默认是黑色。
		 * @param {number} x 矩形路径左上角的x坐标
		 * @param {number} y 矩形路径左上角的y坐标
		 * @param {number} width 矩形路径的宽度
		 * @param {number} height 矩形路径的高度
		 *
		 * @memberOf CanvasContext
		 */
		strokeRect(x: number, y: number, width: number, height: number): void;
		/**
		 * 添加一个弧形路径到当前路径，顺时针绘制。
		 *
		 * @param {number} x 圆的x坐标
		 * @param {number} y 圆的y坐标
		 * @param {number} radius 圆的半径
		 * @param {number} startAngle 起始弧度，单位弧度（在3点钟方向）
		 * @param {number} endAngle 终止弧度
		 * @param {boolean} counterclockwise 指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针。
		 */
		arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
		/**
		 * 创建二次方贝塞尔曲线
		 *
		 * @param {number} cpx 贝塞尔控制点的x坐标
		 * @param {number} cpy 贝塞尔控制点的y坐标
		 * @param {number} x 结束点的x坐标
		 * @param {number} y 结束点的y坐标
		 */
		quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
		/**
		 * 创建三次方贝塞尔曲线
		 *
		 * @param {number} cp1x 第一个贝塞尔控制点的 x 坐标
		 * @param {number} cp1y 第一个贝塞尔控制点的 y 坐标
		 * @param {number} cp2x 第二个贝塞尔控制点的 x 坐标
		 * @param {number} cp2y 第二个贝塞尔控制点的 y 坐标
		 * @param {number} x 结束点的x坐标
		 * @param {number} y 结束点的y坐标
		 */
		bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
		/**
		 * 设置填充样式
		 *
		 * @param {string} color 设置为填充样式的颜色。'rgb(255, 0, 0)'或'rgba(255, 0, 0, 0.6)'或'#ff0000'格式的颜色字符串
		 */
		setFillStyle(color: string): void;
		/**
		 * 设置线条样式
		 *
		 * @param {string} color 设置为填充样式的颜色。'rgb(255, 0, 0)'或'rgba(255, 0, 0, 0.6)'或'#ff0000'格式的颜色字符串
		 */
		setStrokeStyle(color: string): void;
		/**
		 * 设置阴影
		 *
		 * @param {number} offsetX 阴影相对于形状在水平方向的偏移
		 * @param {number} offsetY 阴影相对于形状在竖直方向的偏移
		 * @param {number} blur 阴影的模糊级别，数值越大越模糊 0~100
		 * @param {string} color 阴影的颜色。 'rgb(255, 0, 0)'或'rgba(255, 0, 0, 0.6)'或'#ff0000'格式的颜色字符串
		 */
		setShadow(offsetX: number, offsetY: number, blur: number, color: string): void;

		/**
		 * 创建一个线性的渐变颜色。
		 * Tip: 需要使用 addColorStop() 来指定渐变点，至少要两个。
		 * @param {number} x0 起点的x坐标
		 * @param {number} y0 起点的y坐标
		 * @param {number} x1 终点的x坐标
		 * @param {number} y1 终点的y坐标
		 *
		 * @memberOf CanvasContext
		 */
		createLinearGradient(x0: number, y0: number, x1: number, y1: number): void;

		/**
		 * 创建一个颜色的渐变点。
		 * Tip: 小于最小 stop 的部分会按最小 stop 的 color 来渲染，大于最大 stop 的部分会按最大 stop 的 color 来渲染。
		 * Tip: 需要使用 addColorStop() 来指定渐变点，至少要两个。
		 * @param {number} stop (0-1)	表示渐变点在起点和终点中的位置
		 * @param {string} color 渐变点的颜色
		 *
		 * @memberOf CanvasContext
		 */
		addColorStop(stop: number, color: string): void;

		/**
		 * 创建一个圆形的渐变颜色。
		 *
		 * @param {number} x 圆心的x坐标
		 * @param {number} y 圆心的y坐标
		 * @param {number} r 圆的半径
		 *
		 * @memberOf CanvasContext
		 */
		createCircularGradient(x: number, y: number, r: number): void;
		/**
		 * 设置字体大小
		 *
		 * @param {number} fontSize 字体的字号
		 */
		setFontSize(fontSize: number): void;
		/**
		 * 设置线条端点的样式
		 *
		 * @param {LineCapType} lineCap 线条的结束端点样式。 'butt'、'round'、'square'
		 */
		setLineCap(lineCap: LineCapType): void;
		/**
		 * 设置两线相交处的样式
		 *  @param {LineJoinType} lineJoin 两条线相交时，所创建的拐角类型
		 */
		setLineJoin(lineJoin: LineJoinType): void;
		/**
		 * 设置线条宽度
		 *
		 * @param {number} lineWidth 线条的宽度
		 */
		setLineWidth(lineWidth: number): void;
		/** 设置最大斜接长度，斜接长度指的是在两条线交汇处内角和外角之间的距离。
		 * 当 setLineJoin为 miter 时才有效。
		 * 超过最大倾斜长度的，连接处将以 lineJoin 为 bevel 来显示
		 *
		 * @param {number} miterLimit 最大斜接长度
		 */
		setMiterLimit(miterLimit: number): void;
		/**
		 * 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
		 * Tip: 绘图上下文需要由 wx.createCanvasContext(canvasId) 来创建。
		 * @param {boolean} [reserve] 非必填。本次绘制是否接着上一次绘制，即reserve参数为false，则在本次调用drawCanvas绘制之前native层应先清空画布再继续绘制；若reserver参数为true，则保留当前画布上的内容，本次调用drawCanvas绘制的内容覆盖在上面，默认 false
		 *
		 * @memberOf CanvasContext
		 */
		draw(reserve?: boolean): void;
	}
	/**
	 * 创建并返回绘图上下文context对象。
	 * context只是一个记录方法调用的容器，
	 * 用于生成记录绘制行为的actions数组。c
	 * ontext跟<canvas/>不存在对应关系，
	 * 一个context生成画布的绘制动作数组可以应用于多个<canvas/>。
	 */
	function createContext(): CanvasContext;

	interface DrawCanvasOptions {
		/** 画布标识，传入 <canvas/> 的 cavas-id */
		canvasId: number | string;
		/**
		 * 绘图动作数组，由 wx.createContext 创建的 context，
		 * 调用 getActions 方法导出绘图动作数组。
		 */
		actions: CanvasAction[];
	}
	/**
	 * 绘制画布
	 */
	function drawCanvas(options: DrawCanvasOptions): void;

	interface CanvasToTempFilePathOptions extends BaseOptions {
		/**
		 * 画布标识，传入 <canvas/> 的 cavas-id
		 */
		canvasId: string;
	}
	/**
	 * 把当前画布的内容导出生成图片，并返回文件路径
	 */
	function canvasToTempFilePath(options: CanvasToTempFilePathOptions): void;
}

// 界面-----下拉刷新
declare namespace wx {
	interface Page {
		/**
		 * 在 Page 中定义 onPullDownRefresh 处理函数，监听该页面用户下拉刷新事件。
		 * 需要在 config 的window选项中开启 enablePullDownRefresh。
		 * 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新。
		 */
		onPullDownRefresh(): void;
	}
	/**
	 * 开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致
	 */
	function startPullDownRefresh(): void;
	/**
	 * 停止当前页面下拉刷新。
	 */
	function stopPullDownRefresh(): void;
}

// WXML节点信息
declare namespace wx {
	interface Rect {
		id: string;      // 节点的ID
		dataset: any; // 节点的dataset
		left: number;    // 节点的左边界坐标
		right: number;   // 节点的右边界坐标
		top: number;     // 节点的上边界坐标
		bottom: number;  // 节点的下边界坐标
		width: number;   // 节点的宽度
		height: number;  // 节点的高度
	}
	interface NodesRef {
		/**
		 * 添加节点的布局位置的查询请求，相对于显示区域，以像素为单位。其功能类似于DOM的getBoundingClientRect。返回值是nodesRef对应的selectorQuery。
		 */
		boundingClientRect(callback?: (rect: Rect) => void): SelectorQuery;
		/**
		 * 添加节点的滚动位置查询请求，以像素为单位。节点必须是scroll-view或者viewport。返回值是nodesRef对应的selectorQuery。
		 */
		scrollOffset(callback?: (rect: {
			id: string;			// 节点的ID
			dataset: any;	// 节点的dataset
			scrollLeft: number;	// 节点的水平滚动位置
			scrollTop: number;	// 节点的竖直滚动位置
		}) => void): SelectorQuery;
		fields(options: {
			id?: boolean;	// 是否返回节点id
			dataset?: boolean;	// 是否返回节点dataset
			rect?: boolean;	// 是否返回节点布局位置（left right top bottom）
			size?: boolean;	// 是否返回节点尺寸（width height）
			scrollOffset?: boolean;	// 是否返回节点的 scrollLeft scrollTop ，节点必须是scroll-view或者viewport
			properties?: string[];	// 指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值， id class style 和事件绑定的属性值不可获取）
		}, callback?: (res: { [property: string]: any; }) => void): SelectorQuery;
	}
	interface SelectorQuery {
		/** 将选择器的选取范围更改为自定义组件component内。（初始时，选择器仅选取页面范围的节点，不会选取任何自定义组件中的节点。） */
		in(component: any): SelectorQuery;
		/** 在当前页面下选择第一个匹配选择器selector的节点，返回一个NodesRef对象实例，可以用于获取节点信息。 */
		select(selector: string): NodesRef;
		/** 在当前页面下选择匹配选择器selector的节点，返回一个NodesRef对象实例。 与selectorQuery.selectNode(selector)不同的是，它选择所有匹配选择器的节点。 */
		selectAll(selector: string): NodesRef;
		/** 选择显示区域，可用于获取显示区域的尺寸、滚动位置等信息，返回一个NodesRef对象实例。 */
		selectViewport(): SelectorQuery;
		exec(callback?: (res: any[]) => void): SelectorQuery;
	}

	/**
	 * 返回一个SelectorQuery对象实例。可以在这个实例上使用select等方法选择节点，并使用boundingClientRect等方法选择需要查询的信息。
	 */
	function createSelectorQuery(): SelectorQuery;
}

// 第三方平台
declare namespace wx {
	interface GetExtConfigOption extends BaseOptions {
		success?(ret: {
			errMsg: string; extConfig?: any;
		}): void;
	}
	/**
	 * 获取第三方平台自定义的数据字段。
	 */
	function getExtConfig(options: GetExtConfigOption): void;

	/**
	 * 获取第三方平台自定义的数据字段的同步接口。
	 * 暂时无法通过 wx.canIUse 判断是否兼容，开发者需要自行判断 wx.getExtConfigSync 是否存在来兼容
	 */
	function getExtConfigSync(options: GetExtConfigOption): any;
}

// 开放接口-----登陆
// [签名加密](https://mp.weixin.qq.com/debug/wxadoc/dev/api/signature.html)
declare namespace wx {
	/**
	 * 登录态维护
	 * 通过 wx.login() 获取到用户登录态之后，需要维护登录态。
	 * 开发者要注意不应该直接把 session_key、openid 等字段作为用户的标识
	 * 或者 session 的标识，而应该自己派发一个 session 登录态（请参考登录时序图）。
	 * 对于开发者自己生成的 session，应该保证其安全性且不应该设置较长的过期时间。
	 * session 派发到小程序客户端之后，可将其存储在 storage ，用于后续通信使用。
	 * 通过wx.checkSession() 检测用户登录态是否失效。并决定是否调用wx.login()
	 * 重新获取登录态
	 */
	interface LoginResponse {
		/** 调用结果 */
		errMsg: string;
		/** 用户允许登录后，回调内容会带上 code（有效期五分钟），
		 * 开发者需要将 code 发送到开发者服务器后台，
		 * 使用code 换取 session_key api，
		 * 将 code 换成 openid 和 session_key
		 */
		code: string;
	}
	interface LoginOptions extends BaseOptions {
		/** 接口调用成功的回调函数 */
		success?(res: LoginResponse): void;
	}

	/**
	 * 调用接口获取登录凭证（code）进而换取用户登录态信息，
	 * 包括用户的唯一标识（openid） 及本次登录的 会话密钥（session_key）。
	 * 用户数据的加解密通讯需要依赖会话密钥完成。
	 */
	function login(option: LoginOptions): void;
	type CheckSessionOption = BaseOptions;
	/**
	 * 检测当前用户登录态是否有效。
	 * 通过wx.login获得的用户登录态拥有一定的时效性。用户越久未使用小程序，用户登录态越有可能失效。反之如果用户一直在使用小程序，则用户登录态一直保持有效。具体时效逻辑由微信维护，对开发者透明。开发者只需要调用wx.checkSession接口检测当前用户登录态是否有效。登录态过期后开发者可以再调用wx.login获取新的用户登录态。
	 *
	 * @param {CheckSessionOption} options
	 */
	function checkSession(options: CheckSessionOption): void;
}

// 开放接口-----授权
declare namespace wx {
	type Scope = 'scope.userInfo' | 'scope.userLocation' | 'scope.address' | 'scope.invoiceTitle' | 'scope.werun' | 'scope.record' | 'scope.writePhotosAlbum';
	interface AuthorizeOptions extends BaseOptions {
		scope: Scope;
		success?(res: {
			errMsg: string;
		}): void;
	}
	/**
	 * 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。
	 */
	function authorize(options: AuthorizeOptions): void;
}

// 开放接口-----用户信息
declare namespace wx {
	interface UserInfo {
		nickName: string;
		avatarUrl: string;
		gender: number;
		province: string;
		city: string;
		country: string;
	}
	interface UserInfoResponse {
		/** 用户信息对象，不包含 openid 等敏感信息 */
		userInfo: UserInfo;
		/** 不包括敏感信息的原始数据字符串，用于计算签名。 */
		rawData: string;
		/** 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息。 */
		signature: string;
		/** 包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法 */
		encryptData: string;
	}
	interface GetUserInfoOptions extends BaseOptions {
		withCredentials?: boolean;	// 是否带上登录态信息
		lang?: string;	// 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。默认为en。
		/** 接口调用成功的回调函数 */
		success?(res: UserInfoResponse): void;
	}
	/**
	 * 获取用户信息，需要先调用 wx.login 接口。
	 * 注：当 withCredentials 为 true 时，要求此前有调用过 wx.login 且登录态尚未过期，此时返回的数据会包含 encryptedData, iv 等敏感信息；当 withCredentials 为 false 时，不要求有登录态，返回的数据不包含 encryptedData, iv 等敏感信息。
	 */
	function getUserInfo(options: GetUserInfoOptions): void;

	/**
	 * 获取微信用户绑定的手机号，需先调用login接口。
	 * 因为需要用户主动触发才能发起获取手机号接口，所以该功能不由 API 来调用，需用 <button> 组件的点击来触发。
	 * 注意：目前该接口针对非个人开发者，且完成了认证的小程序开放。需谨慎使用，若用户举报较多或被发现在不必要场景下使用，微信有权永久回收该小程序的该接口权限。
	 * @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/getPhoneNumber.html
	 */
}

// 开放接口-----微信支付
declare namespace wx {
	type PaymentSignType = 'MD5';
	interface RequestPaymentOptions extends BaseOptions {
		/** 时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间 */
		timeStamp: string | number;
		/** 随机字符串，长度为32个字符以下。 */
		nonceStr: string;
		/** 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=* */
		package: string;
		/** 签名算法，暂支持 MD5 */
		signType: PaymentSignType;
		/** 签名,具体签名方案参见微信公众号支付帮助文档; */
		paySign: string;
	}
	/**
	 * 发起微信支付。
	 */
	function requestPayment(options: RequestPaymentOptions): void;
}

// 开放接口-----模板消息 @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/notice.html
declare namespace wx {

}

// 开放接口-----客服消息 @see https://mp.weixin.qq.com/debug/wxadoc/dev/api/custommsg/receive.html
declare namespace wx {
}

// 开放接口-----转发
declare namespace wx {
	interface ShareMenuOptions extends BaseOptions {
		withShareTicket?: boolean;
	}
	/**
	 * 显示分享按钮
	 *
	 * @param {ShowShareMenuOptions} [options]
	 */
	function showShareMenu(options?: ShareMenuOptions): void;
	/**
	 * 隐藏分享按钮
	 *
	 * @param {ShareMenuOptions} [options]
	 */
	function hideShareMenu(options?: BaseOptions): void;

	/**
	 * 更新转发属性
	 */
	function updateShareMenu(options?: ShareMenuOptions): void;

	interface ShareInfoOptions extends BaseOptions {
		shareTicket: string;
		success?(res: {
			errMsg: string;	// 错误信息
			encryptedData: string;	// 包括敏感数据在内的完整转发信息的加密数据，详细见加密数据解密算法
			iv: string;	// 加密算法的初始向量，详细见加密数据解密算法
		}): void;
	}
	/**
	 * 获取转发详细信息
	 */
	function getShareInfo(options?: ShareInfoOptions): void;
}

// 开放接口-----收货地址
declare namespace wx {
	interface ChooseAddressOptions extends BaseOptions {
		success?(res: {
			errMsg: string;	// 调用结果
			userName: string;	// 收货人姓名
			postalCode: string;	// 邮编
			provinceName: string;	// 国标收货地址第一级地址
			cityName: string;	// 国标收货地址第二级地址
			countyName: string;	// 国标收货地址第三级地址
			detailInfo: string;	// 详细收货地址信息
			nationalCode: string;	// 收货地址国家码
			telNumber: string;	// 收货人手机号码
		}): void;
	}
	function chooseAddress(options: ChooseAddressOptions): void;
}

// 开放接口-----卡券
declare namespace wx {
	interface CardExt {
		code?: string	// 参与签名	用户领取的 code，仅自定义 code 模式的卡券须填写，非自定义 code 模式卡券不可填写，详情
		openid?: string	// 参与签名	指定领取者的openid，只有该用户能领取。 bind_openid 字段为 true 的卡券必须填写，bind_openid 字段为 false 不可填写。
		timestamp: number;	// 参与签名	时间戳，东八区时间,UTC+8，单位为秒
		nonce_str?: string	// 参与签名	随机字符串，由开发者设置传入，加强安全性（若不填写可能被重放请求）。随机字符串，不长于 32 位。推荐使用大小写字母和数字，不同添加请求的 nonce_str 须动态生成，若重复将会导致领取失败。
		fixed_begintimestamp?: number;	// 不参与签名	卡券在第三方系统的实际领取时间，为东八区时间戳（UTC+8,精确到秒）。当卡券的有效期类为 DATE_TYPE_FIX_TERM 时专用，标识卡券的实际生效时间，用于解决商户系统内起始时间和领取微信卡券时间不同步的问题。
		outer_str?: string	// 不参与签名	领取渠道参数，用于标识本次领取的渠道值。
		signature: string;	//	签名，商户将接口列表中的参数按照指定方式进行签名,签名方式使用 SHA1，具体签名方案参见：卡券签名
	}
	interface Card {
		cardId: string;
		cardExt: string;
	}
	interface CardOptions extends BaseOptions {
		cardList: Card[];
	}
	/**
	 * 批量添加卡券。
	 */
	function addCard(options: CardOptions): void;
	interface OpenCardOptions extends BaseOptions {
		cardList: {
			cardId: string;
			code: string;
		}[];
	}
	/**
	 * 查看微信卡包中的卡券。
	 *
	 * @param {OpenCardOptions} options
	 */
	function openCard(options: OpenCardOptions): void;
}

// 开放接口-----设置
declare namespace wx {
	interface AuthSetting {
		// [key: Scope]: boolean;
		'scope.userInfo': boolean;
		'scope.userLocation': boolean;
		'scope.address': boolean;
		'scope.invoiceTitle': boolean;
		'scope.werun': boolean;
		'scope.record': boolean;
		'scope.writePhotosAlbum': boolean;
	}
	interface SettingOptions extends BaseOptions {
		success?(res: {
			authSetting: AuthSetting
		}): void;
	}
	/**
	 * 调起客户端小程序设置界面，返回用户设置的操作结果。
	 */
	function openSetting(options: SettingOptions): void;
	/**
	 * 获取用户的当前设置。
	 */
	function getSetting(options: SettingOptions): void;
}

// 开放接口-----微信运动
declare namespace wx {
	interface EncryptedData {
		stepInfoList: {
			timestamp: number;	// 时间戳，表示数据对应的时间
			step: number;	// 微信运动步数
		}[];
	}
	interface GetWeRunDataOption extends BaseOptions {
		success?(res: {
			errMsg: string;	// 调用结果
			encryptedData: string;	// 包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法
			iv: string;	// 加密算法的初始向量，详细见加密数据解密算法
		}): void;
	}
	/**
	 * 获取用户过去三十天微信运动步数，需要先调用 wx.login 接口。
	 */
	function getWeRunData(options: GetWeRunDataOption): void;
}

// 开放接口-----打开小程序
declare namespace wx {
	interface NavigateToMiniProgramOptions extends BaseOptions {
		appId: string; // 要打开的小程序 appId
		path?: string;	// 打开的页面路径，如果为空则打开首页
		extraData?: any; // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
		envVersion?: string;	// 要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） ，仅在当前小程序为开发版或体验版时此参数有效；如果当前小程序是体验版或正式版，则打开的小程序必定是正式版。默认值 release
		success?(res: {
			errMsg: string;
		}): void;
	}

	/**
	 * 打开同一公众号下关联的另一个小程序。
	 */
	function navigateToMiniProgram(options: NavigateToMiniProgramOptions): void;

	interface NavigateBackMiniProgramOptions extends BaseOptions {
		extraData?: any;	// 需要返回给上一个小程序的数据，上一个小程序可在 App.onShow() 中获取到这份数据。详情
		success?(res: {
			errMsg: string;
		}): void;
	}
	/**
	 * 返回到上一个小程序，只有在当前小程序是被其他小程序打开时可以调用成功
	 */
	function navigateBackMiniProgram(options: NavigateBackMiniProgramOptions): void;
}

// 开放接口-----获取发票抬头
declare namespace wx {
	interface ChooseInvoiceTitleOptions extends BaseOptions {
		success?(res: {
			type: string;	// 抬头类型（0：单位，1：个人）
			title: string;	// 抬头名称
			taxNumber: string;	// 抬头税号
			companyAddress: string;	// 单位地址
			telephone: string;	// 手机号码
			bankName: string;	// 银行名称
			bankAccount: string;	// 银行账号
			errMsg: string;	// 接口调用结果
		}): void;
	}
	/**
	 * 选择用户的发票抬头。
	 */
	function chooseInvoiceTitle(options: ChooseInvoiceTitleOptions): void;
}

// 开放接口-----生物认证
declare namespace wx {
	type AuthModes = 'fingerPrint' | 'facial' | 'speech';
	interface CheckIsSupportSoterAuthenticationOptions extends BaseOptions {
		success?(res: {
			supportMode: AuthModes[];	// 该设备支持的可被SOTER识别的生物识别方式
			errMsg: string;	// 接口调用结果
		}): void;
	}
	/**
	 * 获取本机支持的 SOTER 生物认证方式
	 */
	function checkIsSupportSoterAuthentication(options: CheckIsSupportSoterAuthenticationOptions): void;
	interface StartSoterAuthenticationOptions extends BaseOptions {
		requestAuthModes: AuthModes[];	// 请求使用的可接受的生物认证方式
		challenge: string;		// 挑战因子。挑战因子为调用者为此次生物鉴权准备的用于签名的字符串关键是别信息，将作为result_json的一部分，供调用者识别本次请求。例如：如果场景为请求用户对某订单进行授权确认，则可以将订单号填入此参数。
		authContent?: string;	// 验证描述，即识别过程中显示在界面上的对话框提示内容
		success?(res: {
			errCode: number;	// 错误码
			authMode: string;	// 生物认证方式
			resultJSON: string;	// 在设备安全区域（TEE）内获得的本机安全信息（如TEE名称版本号等以及防重放参数）以及本次认证信息（仅Android支持，本次认证的指纹ID）（仅Android支持，本次认证的指纹ID）
			resultJSONSignature: string;	// 用SOTER安全密钥对result_json的签名(SHA256withRSA / PSS, saltlen = 20)
			errMsg: string;	// 接口调用结果
		}): void;
	}
	/**
	 * 开始 SOTER 生物认证
	 */
	function startSoterAuthentication(options: StartSoterAuthenticationOptions): void;

	interface CheckIsSoterEnrolledInDeviceOptions extends BaseOptions {
		checkAuthMode: AuthModes;	// 认证方式
		success?(res: {
			isEnrolled: boolean;	// 是否已录入信息
			errMsg: string;	// 接口调用结果
		}): void;
	}
	/**
	 * 获取设备内是否录入如指纹等生物信息的接口
	 */
	function checkIsSoterEnrolledInDevice(options: CheckIsSoterEnrolledInDeviceOptions): void;
}

// 拓展接口
declare namespace wx {
	/**
	 * 将 ArrayBuffer 数据转成 Base64 字符串
	 */
	function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;
	/**
	 * 将 Base64 字符串转成 ArrayBuffer 数据
	 */
	function base64ToArrayBuffer(base64: string): ArrayBuffer;
}

declare namespace wx {
	/**
	 * 收起键盘。
	 */
	function hideKeyboard(): void;
}

// 调试接口
declare namespace wx {
	interface SetEnableDebugOptions extends BaseOptions {
		enableDebug: boolean;	// 是否打开调试
		success?(res: {
			errMsg: string;
		}): void;
	}
	function setEnableDebug(options: SetEnableDebugOptions): void;
}

// Page
declare namespace wx {
	interface Page {
		/**
		 * setData 函数用于将数据从逻辑层发送到视图层，
		 * 同时改变对应的 this.data 的值。
		 * 注意：
		 *    1. 直接修改 this.data 无效，无法改变页面的状态，还会造成数据不一致。
		 *    2. 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
		 */
		setData(data: any): void;
		data: any;
	}
	/**
	 * Page() 函数用来注册一个页面。
	 * 接受一个 object 参数，其指定页面的初始数据、生命周期函数、事件处理函数等。
	 */
	type PageConstructor = (options: wx.PageOptions) => void;
}
declare var Page: wx.PageConstructor;

// App
declare namespace wx {
	interface App {
		/**
		 * getCurrentPage() 函数用户获取当前页面的实例。
		 * @deprecated
		 */
		getCurrentPage(): Page;
	}
	/**
	 * App() 函数用来注册一个小程序。
	 * 接受一个 object 参数，其指定小程序的生命周期函数等。
	 */
	type AppConstructor = (options: wx.AppOptions) => void;
}

declare namespace wx {
	interface EventTarget {
		id: string;
		tagName: string;
		dataset: { [name: string]: string; };
	}
	interface BaseEvent {
		type: 'tap' | 'touchstart' | 'touchmove' | 'touchcancel' | 'touchend' | 'tap' | 'longtap';
		timeStamp: number;
		currentTarget: EventTarget;
		target: EventTarget;
	}
}

declare namespace wx {
	interface InputEvent extends BaseEvent {
		detail: {
			target: EventTarget;
			value: string;
		};
	}
}

declare namespace wx {
	interface FormEvent extends BaseEvent {
		detail: {
			target: EventTarget;
			value: { [name: string]: string | boolean | number; };
		};
	}
}

declare namespace wx {
	interface Touch {
		identifier: number;
		pageX: number;
		pageY: number;
		clientX: number;
		clientY: number;
	}
	interface TouchEvent extends BaseEvent {
		detail: {
			x: number;
			y: number;
		};
		touches: Touch[];
		changedTouches: Touch[];
	}
}

declare var App: wx.AppConstructor;

/**
 * 我们提供了全局的 getApp() 函数，可以获取到小程序实例。
 */
declare function getApp(): wx.App;

declare function getCurrentPages(): wx.Page[];
