/**
 * Created by rytis on 2015-07-03.
 */
var intervalsWithoutIntersections = [
  { Description: 'Detail1', MinPercentage: 0, MaxPercentage: 20 },
  { Description: 'Detail2', MinPercentage: 40, MaxPercentage: 60 },
  { Description: 'Detail3', MinPercentage: 60, MaxPercentage: 72 }
];

var detailsWithIntersections = [
  { Description: 'Detail1', MinPercentage: 0, MaxPercentage: 21 },
  { Description: 'Detail2', MinPercentage: 20, MaxPercentage: 60 },
  { Description: 'Detail3', MinPercentage: 60, MaxPercentage: 72 }
];

// Numbers and intervals comparison logic
function intervalsIntersect(start1, end1, start2, end2) {
  return inBetween(start1, start2, end2) || inBetween(end1, start2, end2);
}

function inBetween(value, start, end){
  return Math.max.apply(null, arguments) != value && Math.min.apply(null, arguments) != value;
}

function detailsIntervalsIntersect(interval1, interval2) {
  return intervalsIntersect(interval1.MinPercentage, interval1.MaxPercentage, interval2.MinPercentage, interval2.MaxPercentage);
}

// iteration logic
function headWithTail(head) {
  return function (item) {
    return !detailsIntervalsIntersect(head, item);
  }
}

function everyWithEveryIsTrue(list, withHeadComparatorFactory) {
  if (list.length <= 1) { // return if there is nothing to compare
    return true;
  }
  var head = list[0];
  var tail = list.slice(1);
  return (tail.every(withHeadComparatorFactory(head))) && everyWithEveryIsTrue(tail, withHeadComparatorFactory);
}


function reportingHeadWithTail(head) {
  return function (item) {
    var result = detailsIntervalsIntersect(head, item);
    return detailsIntervalsIntersect(head, item) ? head.Details + ' instersects with ' + item.Details : false;
  }
}

function filterNotFalse(item) {
  return item;
}

function validateWithReport(list, withHeadComparatorFactory) {
  if (list.length <= 1) { // return if there is nothing to compare
    return [];
  }
  var head = list[0];
  var tail = list.slice(1);
  return tail
          .map(withHeadComparatorFactory(head))
          .filter(filterNotFalse)
          .concat(
            everyWithEveryIsTrue(tail, withHeadComparatorFactory)
          );
}

function validateIntervals(intervals) {
  var result = validateWithReport(intervals, reportingHeadWithTail);
  if (result.length) {
    throw new Error('There are intersecting intervals' + result.join(', '));
  }
  return true;
}

// Unit test with Jasmine
describe('test final', function () {

  it('should not find intersections', function () {
    expect(everyWithEveryIsTrue(intervalsWithoutIntersections, headWithTail)).toBeTruthy();
  });

  it('should find intersections', function () {
    expect(everyWithEveryIsTrue(detailsWithIntersections, headWithTail)).toBeFalsy();
  });

  it('should return true', function () {
    expect(everyWithEveryIsTrue(new Array(5), function(head) {
      return function (item) {
        return true;
      }
    })).toBeTruthy();
  });

  it('should pass', function() {
    expect(validateIntervals(intervalsWithoutIntersections)).toThrowError(Error);
  });

});
