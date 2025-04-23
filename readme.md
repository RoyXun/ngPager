基于Brant Wills的[angular paging](https://github.com/brantwills/Angular-Paging)修改而来的一个angular分页组件。修改了原先的实现方式，并调整了可配置项：

* 将配置项移入`settings`中
* 删除`disabled`, `textTile*`, `pgHref`等配置
* 增加 `endPoint`, `dotsClass`配置



`endPoint`表示出现省略号时，列表两端的页码数。如`endPoint`为2时，`1, 2, ..., 6, 7, 8, ..., 12, 13`; `endPoint`位3时， `1, 2, 3, ..., 7, 8, 9, 10, 11, ..., 14, 15, 16`。


## 典型用法 ##

[live demo及用法](./ngPager/index.html)

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
