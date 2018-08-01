import React from 'react';
import {PageWithHeader} from '../../../components';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import {isHtml, isUrl, isImage} from '../../../utils/validate';
import './NewsDetail.less';

const findDetailByID = (list, id, detailName) => {
  const filtered = list.filter(item => {
    return (item.id + '') === id
  });
  if (filtered.length > 0) {
    return filtered[0][detailName]
  }
  return '';
};

/**
 * 资讯详情
 */
@inject('userStore')
@observer
class NewsDetail extends React.Component {
  constructor(props) {
    super(props);
    const messageId = props.match.params.id;
    const list = toJS(props.userStore.newsList);
    const detail = findDetailByID(list, messageId, 'content');
    this.state = {
      detail
    }
  }

  /**
   * 渲染内容
   * image：直接渲染图片
   * 网页链接：iframe打开链接
   * html字符串：渲染html内容
   * @param detail
   * @returns {XML}
   */
  renderContent = (detail) => {
    if (isImage(detail)) {
      return this.renderImage(detail);
    }
    if (isUrl(detail)) {
      return this.renderUrl(detail)
    }
    if (isHtml(detail)) {
      return this.renderHtml(detail)
    }
    return <div>无法解析的内容</div>
  };

  renderImage = (src) => {
    return (
       <img src={src} className="image-content" />
    )
  };

  renderUrl = (url) => {
    return <iframe src={url} width="100%" height="100%" />
  };

  renderHtml = (htmlStr) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlStr }} className="html-string-content" />
  };

  render() {
    return (
      <PageWithHeader title="资讯详情" id="page-news-detail">
        <div className="body">
          {
            this.renderContent(this.state.detail)
          }
        </div>
      </PageWithHeader>
    )
  }
};

export default NewsDetail;
