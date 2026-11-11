/**
 * Arrange-Act-Assert Test Harness (Week 5 Task 3)
 */

const assert = require('assert');

const registeredSuites = [];
let currentSuite = null;

function describe(suiteName, fn) {
  const suite = { name: suiteName, tests: [] };
  registeredSuites.push(suite);
  const previousSuite = currentSuite;
  currentSuite = suite;
  fn();
  currentSuite = previousSuite;
}

function test(testName, fn) {
  if (!currentSuite) {
    describe('Default Suite', () => {});
    currentSuite = registeredSuites[registeredSuites.length - 1];
  }
  currentSuite.tests.push({ name: testName, fn });
}

function expect(actual) {
  return {
    toBe(expected) {
      assert.strictEqual(actual, expected);
    },
    toEqual(expected) {
      assert.deepStrictEqual(actual, expected);
    },
    toBeTruthy() {
      assert.ok(actual);
    },
    toContain(item) {
      assert.ok(
        Array.isArray(actual) || typeof actual === 'string',
        'Expected array or string for toContain'
      );
      assert.ok(actual.includes(item), `Expected "${actual}" to contain "${item}"`);
    },
  };
}

function runAllSuites() {
  let passed = 0;
  let failed = 0;

  console.log('====================================================================');
  console.log(' MOTORCYCLE REPAIR SHOP MANAGEMENT SYSTEM — AUTOMATED TEST SUITE');
  console.log('====================================================================\n');

  for (const suite of registeredSuites) {
    console.log(`Suite: ${suite.name}`);
    for (const testCase of suite.tests) {
      try {
        testCase.fn();
        passed++;
        console.log(`  [PASS] ${testCase.name}`);
      } catch (err) {
        failed++;
        console.error(`  [FAIL] ${testCase.name}`);
        console.error(`         ${err.message}`);
      }
    }
    console.log('');
  }

  console.log('--------------------------------------------------------------------');
  console.log(`Total Tests: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log('--------------------------------------------------------------------');

  if (failed > 0) {
    process.exitCode = 1;
  }
  return { passed, failed };
}

module.exports = {
  describe,
  test,
  expect,
  runAllSuites,
};
