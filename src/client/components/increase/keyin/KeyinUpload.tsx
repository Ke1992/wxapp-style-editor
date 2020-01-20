// 库
import React, {
    Component,
    ReactNode,
    RefObject,
} from 'react';
// 样式
require('./KeyinUpload.scss');
// 常量
const IMAGE_MAX_SIZE = 1024 * 1024 * 2; // 图片上传大小限制（2M）
const VALID_IMAGE_SUFFIX = new Set(['image/png', 'image/jpg', 'image/jpeg', 'image/gif']);
// 定义
interface KeyinUploadProps {
    cover: string;
    showDialog: Function;
    updateCover: Function;
}

export default class KeyinUpload extends Component<KeyinUploadProps, {}> {
    private fileInput: RefObject<HTMLInputElement> = React.createRef();

    public constructor(props: KeyinUploadProps) {
        super(props);

        // 绑定函数
        this.handleUploadEvent = this.handleUploadEvent.bind(this);
        this.handleImageEvent = this.handleImageEvent.bind(this);
    }

    public render(): ReactNode {
        const {
            cover,
            updateCover,
        } = this.props;

        return (
            <section className="tangram-keyin-upload">
                <div className="tangram-keyin-upload-btn">
                    <i className="fas fa-cloud-upload-alt"></i>上传
                    <input
                        type="file"
                        ref={ this.fileInput }
                        onChange={
                            (event: React.ChangeEvent): void => this.handleUploadEvent(event)
                        }
                    />
                </div>
                <div
                    onClick={ (): void => updateCover('') }
                    className={['tangram-keyin-upload-btn', 'clear', cover ? '' : 'hide'].join(' ')}
                >清空</div>
                <img
                    src={ cover }
                    onClick={ (): void => this.handleImageEvent() }
                    className={['tangram-keyin-upload-image', cover ? '' : 'hide'].join(' ')}
                />
            </section>
        );
    }

    // --------------------事件处理函数--------------------
    /**
     * 上传按钮点击事件
     * @param event [事件对象]
     */
    private handleUploadEvent(event: React.ChangeEvent): void {
        const {
            showDialog,
            updateCover,
        } = this.props;
        const file = (event.target as HTMLInputElement).files[0];
        // 如果没选择图片，直接返回
        if (!file) {
            return;
        }

        // 超过最大限制
        if (file.size >= IMAGE_MAX_SIZE) {
            showDialog('仅允许上传2M以下的图片');
            return;
        }

        // 图片格式异常，直接返回
        if (!VALID_IMAGE_SUFFIX.has(file.type)) {
            showDialog(`仅支持以下图片格式：<br>${[...VALID_IMAGE_SUFFIX].join('、')}`, '请选择正确的图片格式');
            return;
        }

        // 转换为base64的格式
        const reader = new FileReader();
        // 监听结果
        reader.onloadend = (): void => {
            // TODO: 这里应该将base64转换成图片url
            updateCover(reader.result.toString());
        };
        // 监听异常
        reader.onerror = (error): void => {
            showDialog(`请稍后重试, 错误信息: ${error}`, '上传图片失败');
            // 失败也直接置空
            this.fileInput.current.value = '';
        };
        // 读取文件数据
        reader.readAsDataURL(file);
    }

    /**
     * 图片点击事件
     */
    private handleImageEvent(): void {
        const {
            cover,
            showDialog,
        } = this.props;

        // 预览图片
        showDialog(`<img style="max-height: 400px;display: block;margin: auto;" src="${cover}"/>`, '图片预览');
    }
}
