require "test_helper"

class ApplicationTestHelper < ActionView::TestCase
    test "full title helper" do
        assert_equal full_title, "Ruby on Rails Sample App"
        assert_equal full_title("Help"), "About | Ruby on Rails Sample App"
    end
end
