import json
import sys
import sqlite3
import html

def createDatabase():
    connection = sqlite3.connect('/var/CSE113/alexurda/commentsQuestionsDatabase.db')
    database = connection.cursor()
    database.execute("CREATE TABLE IF NOT EXISTS feedback (name TEXT, comment TEXT)")
    connection.commit()
    return connection

def addComment(request, database):
    name = request["name"]
    comment = request["comment"]
    if name == "None" or comment == "None":
        return
    name = html.escape(name)
    comment = html.escape(comment)
    database.execute("INSERT INTO feedback (?, ?)", (name, comment))

def collectComments(database):
    comments = []

    for row in database.execute('SELECT * FROM feedback'):
        comments.append(row)

    return json.dumps(comments)

def handleRequest(request):
    try:
        database = createDatabase()

        if request["requestType"] == "addComment":
            addComment(request, database.cursor())
            response = "Comment submitted!"
        elif request["requestType"] == "collectComments":
            response = collectComments(database.cursor())
        else:
            response = "Invalid request type"

        database.commit()
        database.close()
        return response
    except AttributeError as err:
        print(err)
    except:
        return sys.exc_info()[0]