# check if n is a multiple of ANY of the factors
def isMultiple(n, factors)
  factors.length.times do |i|
    if n % factors[i] === 0
      return true
    end
  end
  return false
end

# get sum of multiples of factors (between start and stop)
def getSum(start, stop, factors)
  sum = 0
  (stop-start+1).times do |i|
    n = i + start
    if isMultiple(n, factors)
      sum += i
    end
  end
  return sum
end

puts getSum(0, 1000, [3, 5])
