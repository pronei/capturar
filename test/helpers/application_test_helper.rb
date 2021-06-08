require "test_helper"

class ApplicationTestHelper < ActionView::TestCase
    test "full title helper" do
        assert_equal full_title, "Sample App"
        assert_equal full_title("Help"), "About | Sample App"
    end
end
