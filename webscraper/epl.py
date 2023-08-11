from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions
from webdriver_manager.chrome import ChromeDriverManager


def make_webdriver():
    """Create a return a webdriver object."""
    options = Options()
    # This will write shared memory files into /tmp instead of /dev/shm.
    # See crbug.com/736452 for more details.
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("user-data-dir=data/selenium-user-data")

    # Set the current directory as the default download directory.
    # prefs = {"download.default_directory": DATA_DIR.__str__()}
    # options.add_experimental_option("prefs", prefs)

    driver = webdriver.Chrome(
        service=ChromeService(ChromeDriverManager().install()), options=options
    )
    return driver


def login(driver):
    base_url = "https://fantasy.premierleague.com/"
    landing_url = "https://fantasy.premierleague.com/my-team"
    driver.get(base_url)
    # Wait up to 5 minutes for the user to log in.
    WebDriverWait(driver, 300).until(expected_conditions.url_to_be(landing_url))


driver = make_webdriver()
login(driver)
