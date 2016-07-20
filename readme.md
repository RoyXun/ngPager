#rxPager
---

基于Brant Wills的[angular paging](https://github.com/brantwills/Angular-Paging)修改的angular分页组件。原来的组件可以配置当前页相邻页码数（adjacent），这个逻辑和我在项目中遇到的场景不太一致，我遇到的需求大多是限制最多显示页码数，所以我修改原来的实现方式，并对配置项做了调整：

- 将一些配置项移入`settings`选项中
- 删除`disabled`,`textTitle*`,`pgHref`,`adjacent`等配置
- 增加`maxVisible`, `endPoint`配置

其中`maxVisible`表示组件最多显示的页码数，当总页码超出`maxVisible`时出现省略号，由于要保证当前页相邻页码至少为1，所以限制`maxVisible> 5`, 理论上这个值只要大于5就可以，但是个人认为太大没有意义，所以硬编码不得超过20页；
`endPoint`表示出现省略号时，列表两端页码数(如`endPoint`为2时：`1, 2, ..., 6, 7, 8, ..., 12, 13`； `endPoint`为3： `1, 2, 3, ..., 7, 8, 9, 10, 11, ..., 14, 15, 16)`。`endPointer`只能为1,2或3。

**注意：** 	`maxVisble`	不得小于`(2 * endPoint + 3)`, 否则会忽略`maxVisible`设置，直接取值为`(2 * endPoint + 3)`

## 典型用法

点击查看[demo](http://xunqilong.com/demos/ng/ngPager.html)

```html
<rx-pager page="page" page-size="pageSize" total="total" paging-action="pageAction(page, pageSize, total)">
```
```javascript
angular.module('yourApp', ['rx.pager']).controller('yourCtrl', ['$scope', function($scope) {
	$scope.page = 1;
	$scope.pageSize = 10;
	$scope.total = 100;
	$scope.pageAction = function(page, pageSize, total) {
		// do your ajax
	};	
}]);
```