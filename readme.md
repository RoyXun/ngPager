基于Brant Wills的[angular paging](https://github.com/brantwills/Angular-Paging)修改而来的一个angular分页组件。原先的组件可以配置当前页相邻页码数(`adjacent`),然而我在实际项目中遇到的比较多的情况是限制最多显示的页码个数，所以修改了原先的实现方式，并调整了可配置项：

* 将配置项移入`settings`中
* 删除`disabled`, `textTile*`, `pgHref`, `adjacent`等配置
* 增加`maxVisible`, `endPoint`配置

其中`maxVisible`表示组件最多显示的页码数。当总页码超过`maxVisible`时出现省略号，由于需要保证当前页相邻页码左右至少各有1个，所以限制maxVisible > 5。理论上这个值只需要大于5就成，但个人认为这个值给的太大没有意义，就加了个最大不超过20的限制。

`endPoint`表示出现省略号时，列表两端的页码数。如`endPoint`为2时，`1, 2, ..., 6, 7, 8, ..., 12, 13`; `endPoint`位3时， `1, 2, 3, ..., 7, 8, 9, 10, 11, ..., 14, 15, 16`。endPoint只能为1,2或3。

**注意：** `maxVisible`不得小于 ` 2 * endPoint + 3`, 否则会忽略`maxVisible`设置，直接取`2*endPoint + 3`

##典型用法##

[live demo及用法](http://xunqilong.com/ngPager/index.html)

```html
<rx-pager page="page" page-size="pageSize" total="total" paging-action="paing(page, pageSize, total)"></rx-pager>

```
```javascript
angular.module('yourApp', ['rx.pager']).controller('yourCtrl', ['$scope', function($scope) {
    $scope.page = 1;
    $scope.pageSize = 10;
    $scope.total = 100;
    $scope.paging = function(page, pageSize, total) {
        //do your ajax
    };
}])
```
