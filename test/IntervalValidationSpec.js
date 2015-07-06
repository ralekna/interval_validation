// Numbers and intervals comparison logic
function intervalsIntersect(start1, end1, start2, end2) {
  return inBetween(start1, start2, end2) || inBetween(end1, start2, end2);
}

function inBetween(value, start, end){
  return Math.max.apply(null, arguments) != value && Math.min.apply(null, arguments) != value;
}

// Validation logic
function getDetailsIntersectionReport(interval1, interval2) {
  var comparisonResult = intervalsIntersect(interval1.MinPercentage, interval1.MaxPercentage, interval2.MinPercentage, interval2.MaxPercentage);
  return comparisonResult ? ('[' + interval1.Description + ' instersects with ' + interval2.Description + '], ') : '';
}

function compareHeadWithTailFunctionFactory(head, comparatorFunction) {
  return function ( previous, item) {
    return previous + comparatorFunction(head, item);
  }
}

// you have to inject custom comparator function to make this function generic
function validateWithReport(list, comparatorFunction) {
  if (list.length <= 1) { // return if there is nothing to compare
    return '';
  }
  var head = list[0];
  var tail = list.slice(1);
  return tail.reduce(compareHeadWithTailFunctionFactory(head, comparatorFunction), 
  '' // initial value - empty string
  ) + validateWithReport(tail, comparatorFunction);

}

function validateIntervals(intervals) {
  var result = validateWithReport(intervals, getDetailsIntersectionReport);
  if (result.length) {
    throw new Error('There are intersecting intervals: ' + result);
  }
  return true;
}

// Unit test with Jasmine
describe('validation with report', function() {
  
  var intervalsWithoutIntersections = [
    { Description: 'Detail1', MinPercentage: 0, MaxPercentage: 20 },
    { Description: 'Detail2', MinPercentage: 40, MaxPercentage: 60 },
    { Description: 'Detail3', MinPercentage: 60, MaxPercentage: 72 }
  ];

  var intervalsWithIntersections = [
    { Description: 'Detail4', MinPercentage: 0, MaxPercentage: 21 },
    { Description: 'Detail5', MinPercentage: 20, MaxPercentage: 60 },
    { Description: 'Detail6', MinPercentage: 60, MaxPercentage: 72 }
  ];  
  
  it('should report with exception about error', function() {
    expect( function() { // wrapping into closure to catch error properly
      validateIntervals(intervalsWithIntersections)
    }).toThrowError();
  });

  it('should report validation with true', function() {
    expect(validateIntervals(intervalsWithoutIntersections)).toBeTruthy();
  });

});
